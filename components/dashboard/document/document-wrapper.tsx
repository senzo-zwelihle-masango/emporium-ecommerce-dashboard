'use client'

import { useState } from 'react'
import { Document as PrismaDocument, User } from '@/lib/generated/prisma'
import DocumentTabs from '@/components/dashboard/document/document-tabs'
import DocumentGrid from '@/components/dashboard/document/document-grid'
import { toast } from 'sonner'

interface DocumentWrapperProps {
  documents: (PrismaDocument & { user: User })[]
}

const DocumentWrapper = ({ documents }: DocumentWrapperProps) => {
  const [activeTab, setActiveTab] = useState('recent')

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === 'recent') return true
    if (activeTab === 'starred' && doc.starred) return true
    if (
      activeTab === 'shared' &&
      typeof (doc as { shared?: boolean }).shared === 'boolean' &&
      (doc as { shared?: boolean }).shared
    )
      return true
    return false
  })
  const handleToggleStar = (id: string) => {
    toast.info(`Toggling star on document with id: ${id}`)
  }
  return (
    <>
      <DocumentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <DocumentGrid documents={filteredDocuments} onToggleStar={handleToggleStar} />
    </>
  )
}

export default DocumentWrapper
