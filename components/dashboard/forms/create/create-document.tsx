'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { PlusIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import DocumentViewer from '@/components/tools/document-viewer'

import { UploadDropzone } from '@/utils/upload/uploadthing'

import { tryCatch } from '@/hooks/use-try-catch'

import { createDocumentAction } from '@/server/actions/dashboard/document'
import { documentSchema, DocumentSchemaType } from '@/schemas/dashboard/document'
import { DocumentStatus } from '@/lib/generated/prisma'

const CreateDocumentForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  //   Form Zod validation.
  const form = useForm<DocumentSchemaType>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      status: 'active',
      file: '',
      starred: false,
    },
  })
  //   call server action to submit form
  function onSubmit(values: DocumentSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createDocumentAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/documents')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. August Invoices" {...field} />
              </FormControl>
              <FormDescription>Give the file a short, descriptive name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel> Document Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a document status" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>

                      {Object.keys(DocumentStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="starred"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Star Document</FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      name={field.name}
                      ref={field.ref}
                      aria-label="Toggle Active"
                    />
                  </FormControl>

                  <Label htmlFor={field.name} className="text-sm font-medium">
                    {field.value ? 'On' : 'Off'}
                  </Label>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* file  */}
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <div>
                  {field.value ? (
                    <div className="relative">
                      <DocumentViewer documentUrl={field.value} />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 rounded-full"
                        onClick={() => field.onChange('')}
                      >
                        <XIcon />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="documentUploader"
                      onClientUploadComplete={(res) => {
                        field.onChange(res[0].ufsUrl)
                        toast.success('document uploaded successfully!')
                      }}
                      onUploadError={() => {
                        toast.error('Something went wrong. Please try again.')
                      }}
                      className="ut-button:rounded-full ut-button:bg-ultramarine-700 ut-allowed-content:text-muted-foreground mt-4"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <PlusIcon />
              Upload Document
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateDocumentForm
