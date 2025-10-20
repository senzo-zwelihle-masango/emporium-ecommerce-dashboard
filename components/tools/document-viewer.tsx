'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

interface DocumentViewerProps {
  documentUrl: string
}

const DocumentViewer = ({ documentUrl }: DocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document
        file={documentUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Spinner />}
        className="rounded-lg"
      >
        <Page pageNumber={pageNumber} />
      </Document>
      <div className="mt-4 text-center">
        <p>
          Page {pageNumber} of {numPages || '...'}
        </p>
        <div className="mt-2 space-x-2">
          <Button
            type="button"
            variant={'outline'}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant={'outline'}
            disabled={pageNumber >= (numPages || 0)}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer
