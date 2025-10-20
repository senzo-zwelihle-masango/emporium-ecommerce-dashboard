'use client'

import React from 'react'
import '@blocknote/shadcn/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { PartialBlock } from '@blocknote/core'
import { useTheme } from 'next-themes'
import * as Button from '@/components/ui/button'

interface BlocknoteEditorProps {
  onChange: (value: string) => void
  initialContent?: string
  editable?: boolean
}

const BlocknoteEditor = ({ onChange, initialContent, editable = true }: BlocknoteEditorProps) => {
  // Creates a new editor instance.
  const { resolvedTheme } = useTheme()

  const editor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
  })
  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      onChange={() => {
        if (editable) {
          onChange(JSON.stringify(editor.document, null, 2))
        }
      }}
      editable={editable}
      data-color-scheme={resolvedTheme}
      shadCNComponents={{
        // Pass modified ShadCN components from your project here.
        // Otherwise, the default ShadCN components will be used.
        Button: {
          Button: (props) => <Button.Button {...props} type="button" />,
        },
      }}
    />
  )
}

export default BlocknoteEditor
