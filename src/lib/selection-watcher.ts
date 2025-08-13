import type { Editor } from '@tiptap/core'
// SelectionWatcher.ts
import { Extension } from '@tiptap/core'
import { NodeSelection, Plugin, PluginKey } from 'prosemirror-state'

type SelectionKind = 'word' | 'sentence' | 'paragraph' | 'other'

export interface SelectionWatcherOptions {
  /**
   * Fired on any selection change that isn't empty.
   * Decide what to do based on `kind`.
   */
  onMatch?: (info: {
    kind: SelectionKind
    text: string
    from: number
    to: number
    wordCount: number
  }, ctx: { editor: Editor }) => void

  /**
   * If true, trigger only when the selection is
   * exactly a single word, one sentence, or entire paragraph.
   * If false, fire for any non-empty selection.
   */
  strict?: boolean
}

const key = new PluginKey('selectionWatcher')

export const SelectionWatcher = Extension.create<SelectionWatcherOptions>({
  name: 'selectionWatcher',
  addOptions() {
    return {
      onMatch: undefined,
      strict: true,
    }
  },

  addProseMirrorPlugins() {
    const { editor } = this
    const opts = this.options

    function getSelectedText(from: number, to: number) {
      // Use a space separator so inline nodes don’t smash together
      return editor.state.doc.textBetween(from, to, ' ')
    }

    function countWords(s: string) {
      // counts tokens with letters/digits and internal ' or - (e.g. can't, long-term)
      const m = s.trim().match(/[A-Za-zÀ-ÖØ-öø-ÿĞğİıŞş0-9]+(?:['’\-][A-Za-zÀ-ÖØ-öø-ÿĞğİıŞş0-9]+)*/g)
      return m ? m.length : 0
    }

    function isSingleWord(text: string) {
      return countWords(text) === 1
    }

    // naive “one sentence” heuristic: ends with . ! ? (or …),
    // doesn’t contain multiple sentence terminators, and not just whitespace
    function isSingleSentence(text: string) {
      const t = text.trim()
      if (!t)
        return false
      const endsLikeSentence = /(\.\s*$|!\s*$|\?\s*$|…\s*$)/.test(t)
      if (!endsLikeSentence)
        return false
      // If multiple sentence enders appear inside, treat as more than one sentence
      const enders = t.match(/[.!?…]/g)
      return (enders?.length ?? 0) === 1
    }

    function isEntireParagraph(from: number, to: number) {
      const { state } = editor
      const sel = state.selection
      const $from = state.doc.resolve(from)
      const $to = state.doc.resolve(to)

      // If it’s a NodeSelection of a paragraph, that’s a full paragraph.
      if (sel instanceof NodeSelection) {
        return sel.node.type.name === 'paragraph'
      }

      // For text selections, check whether we span exactly one paragraph’s content
      // i.e., positions align to paragraph start/end
      const sameDepth = $from.depth === $to.depth
      if (!sameDepth)
        return false

      // climb to the nearest paragraph on both ends
      let fromDepth = $from.depth
      while (fromDepth > 0 && $from.node(fromDepth).type.name !== 'paragraph') fromDepth--
      let toDepth = $to.depth
      while (toDepth > 0 && $to.node(toDepth).type.name !== 'paragraph') toDepth--

      if (fromDepth <= 0 || toDepth <= 0)
        return false
      if (fromDepth !== toDepth)
        return false

      const paraFromPos = $from.start(fromDepth)
      const paraToPos = $from.end(fromDepth)
      return from === paraFromPos && to === paraToPos
    }

    function classifySelection(from: number, to: number): { kind: SelectionKind, text: string, wordCount: number } {
      const text = getSelectedText(from, to)
      const wordCount = countWords(text)

      if (!text.trim())
        return { kind: 'other', text, wordCount }

      if (isSingleWord(text))
        return { kind: 'word', text, wordCount }
      if (isSingleSentence(text))
        return { kind: 'sentence', text, wordCount }
      if (isEntireParagraph(from, to))
        return { kind: 'paragraph', text, wordCount }

      return { kind: 'other', text, wordCount }
    }

    let lastFrom = -1
    let lastTo = -1

    return [
      new Plugin({
        key,
        view: () => ({
          update: (view) => {
            const sel = view.state.selection
            if (sel.empty)
              return

            const from = sel.from
            const to = sel.to
            if (from === lastFrom && to === lastTo)
              return
            lastFrom = from
            lastTo = to

            const result = classifySelection(from, to)
            if (!opts.onMatch)
              return

            if (opts.strict) {
              // Only fire for exact word, sentence, or full paragraph
              if (result.kind === 'word' || result.kind === 'sentence' || result.kind === 'paragraph') {
                opts.onMatch(result, { editor })
              }
            }
            else {
              // Fire for any non-empty selection
              opts.onMatch(result, { editor })
            }
          },
        }),
      }),
    ]
  },
})
