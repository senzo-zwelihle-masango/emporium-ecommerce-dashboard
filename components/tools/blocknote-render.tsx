'use client'

import React from 'react'
import '@blocknote/shadcn/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { PartialBlock } from '@blocknote/core'
import { useTheme } from 'next-themes'
import * as Button from '@/components/ui/button'

interface BlockNoteRenderProps {
  initialContent: string
}

const BlockNoteRender = ({ initialContent }: BlockNoteRenderProps) => {
  const { resolvedTheme } = useTheme()

  const blocks: PartialBlock[] = initialContent ? JSON.parse(initialContent) : []

  const editor = useCreateBlockNote({
    initialContent: blocks,
  })
  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      editable={false}
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

export default BlockNoteRender
