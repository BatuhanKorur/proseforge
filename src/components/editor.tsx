'use client'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
function Editor(){
    const editor = useEditor({
        extensions: [
            StarterKit
        ],
        immediatelyRender: false,
    })

    if(!editor) return null

    return (
        <>
                <EditorContent editor={editor} />
        </>
    )
}

export default Editor;
