'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect, useRef } from 'react'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

import { toast } from 'sonner'
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  FileIcon,
  RotateCcwIcon,
  DownloadIcon,
  Share2Icon,
} from 'lucide-react'
import { User } from '@/lib/generated/prisma'

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString()

interface ModalDocumentViewerProps {
  documentUrl: string
  documentName: string
  documentUser: User
}

const ModalDocumentViewer = ({
  documentUrl,
  documentName,
  documentUser,
}: ModalDocumentViewerProps) => {
  const [numPages, setNumPages] = useState<number>()
  const [pageNumber, setPageNumber] = useState(1)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const resizeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!viewerRef.current) return
    const el = viewerRef.current
    const ro = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      const newWidth = entries[0]?.contentRect.width
      if (newWidth) {
        resizeTimeoutRef.current = window.setTimeout(() => {
          setContainerWidth(Math.floor(newWidth))
        }, 100)
      }
    })

    ro.observe(el)
    setContainerWidth(Math.floor(el.getBoundingClientRect().width))

    return () => {
      ro.disconnect()
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(documentUrl)
    toast.success('Document link copied to clipboard!', {
      description: `You can now share "${documentName}" with others.`,
    })
  }

  const { theme } = useTheme()

  return (
    <div
      className={cn('flex h-full w-full flex-col p-2', theme === 'dark' ? 'bg-black' : 'bg-white')}
    >
      {/* Viewer Area */}
      <div
        ref={viewerRef}
        className="flex flex-1 items-center justify-center overflow-auto rounded-lg shadow-inner"
      >
        <div className="flex h-full w-full items-center justify-center">
          <Document
            file={documentUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center text-center">
                <Spinner className="text-primary h-10 w-10" />
                <p className="mt-4">Loading document...</p>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FileIcon className="text-destructive mb-2 h-10 w-10" />
                <h3 className="text-xl font-semibold">Failed to load document</h3>
                <p className="text-muted-foreground mt-2">
                  Please check the document URL or try again later.
                </p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
                  <RotateCcwIcon className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
              </div>
            }
            className="overflow-hidden rounded-lg"
          >
            {containerWidth && (
              <Page
                pageNumber={pageNumber}
                width={Math.min(containerWidth, 1200)}
                loading={<Spinner className="m-auto" />}
                renderAnnotationLayer={false}
                renderTextLayer={false}
              />
            )}
          </Document>
        </div>
      </div>

      {/* Footer with Actions and Info */}
      <div className="border-border mt-auto flex items-center justify-between border-t p-4">
        {/* Ownership Info */}
        <p className="text-muted-foreground text-sm">
          Owned by <span className="text-foreground font-semibold">{documentUser.name}</span>
        </p>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2Icon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <a href={documentUrl} download={documentName}>
            <Button variant="outline" size="sm">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Page {pageNumber} of {numPages || '...'}
        </p>
        <div className="mt-2 space-x-2">
          <Button
            type="button"
            variant={'outline'}
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber((prev) => prev - 1)}
          >
            <ChevronsLeftIcon className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            type="button"
            variant={'outline'}
            disabled={pageNumber >= (numPages || 0)}
            onClick={() => setPageNumber((prev) => prev + 1)}
          >
            Next
            <ChevronsRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModalDocumentViewer
