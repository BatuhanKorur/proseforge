import type { Node as ProseMirrorNode } from 'prosemirror-model'
import type { EditorState, Transaction } from 'prosemirror-state'
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from 'prosemirror-state'

import { Decoration, DecorationSet } from 'prosemirror-view'

export interface SpellCheckOptions {
  errors: string[]
  errorClass: string
}

export interface SpellCheckStorage {
  errors: string[]
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const SpellCheckExtension = Extension.create({
  name: 'spellcheck',
  addOptions() {
    return {
      errors: [],
      errorClass: 'text-red-400',
    }
  },

  addStorage() {
    return {
      errors: this.options.errors as string[],
    }
  },

  // @ts-ignore
  addCommands() {
    return {
      setSpellErrors: (words: string[]) => ({ state, dispatch }: { state: EditorState, dispatch?: (tr: Transaction) => void }) => {
        this.storage.errors = words
        if (dispatch) {
          // A transaction is dispatched to force ProseMirror to re-render decorations.
          const tr = state.tr.setMeta('forceUpdate', true)
          dispatch(tr)
        }
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('spellcheck'),
        props: {
          decorations: (state: EditorState) => {
            const { errors } = this.storage
            const { errorClass } = this.options

            if (errors.length === 0)
              return DecorationSet.empty

            const decorations: Decoration[] = []
            const misspeltWordsRegex = new RegExp(`\\b(${errors.map(escapeRegExp).join('|')})\\b`, 'gi')

            state.doc.descendants((node: ProseMirrorNode, pos: number) => {
              if (!node.isText || !node.text)
                return

              for (const match of node.text.matchAll(misspeltWordsRegex)) {
                const from = pos + (match.index ?? 0)
                const to = from + match[0].length

                decorations.push(
                  Decoration.inline(from, to, { class: errorClass }),
                )
              }
            })

            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})
