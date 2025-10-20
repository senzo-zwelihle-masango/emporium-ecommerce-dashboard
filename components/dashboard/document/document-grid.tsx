'use client'

import { Document as PrismaDocument, User } from '@/lib/generated/prisma'
import DocumentCard from './document-card'

interface DocumentGridProps {
  documents: (PrismaDocument & { user: User })[]
  onToggleStar: (id: string) => void
}

const DocumentGrid = ({ documents, onToggleStar }: DocumentGridProps) => {
  if (documents.length === 0) {
    return (
      <div className="py-24 text-center">
        <h3 className="mb-2 text-lg font-semibold">No documents found</h3>
        <p>Try adjusting your search or check a different tab</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          id={document.id}
          name={document.name}
          status={document.status}
          file={document.file}
          starred={document.starred}
          archived={document.archived}
          deletedAt={document.deletedAt}
          onToggleStar={onToggleStar}
          createdAt={document.createdAt}
          updatedAt={document.updatedAt}
          user={document.user}
        />
      ))}
    </div>
  )
}

export default DocumentGrid
