import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const SpellCheckExtension = Extension.create({
  name: 'spellcheck',
  addOptions() {
    return {
      errors: [],
      errorClass: 'text-red-400',
    }
  },

  addProseMirrorPlugins() {
    const { errors, errorClass } = this.options
    const key = new PluginKey('spellcheck')
    return [
      new Plugin({
        key,
        props: {
          decorations(state) {
            const decorations: Decoration[] = []

            // Walk all text nodes and look for error words
            state.doc.descendants((node: any, pos: number) => {
              if (!node.isText)
                return true
              const text = node.text
              if (!text)
                return true

              for (const word of errors) {
                // Simple substring match; adjust if you want word-boundaries
                let from = 0
                while (true) {
                  const idx = text.indexOf(word, from)
                  if (idx === -1)
                    break
                  decorations.push(
                    Decoration.inline(pos + idx, pos + idx + word.length, {
                      class: errorClass,
                    }),
                  )
                  from = idx + word.length
                }
              }

              return true
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
