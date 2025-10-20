'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { PlusIcon } from 'lucide-react'

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
import { Textarea } from '@/components/ui/textarea'

import { tryCatch } from '@/hooks/use-try-catch'

import { createNoteAction } from '@/server/actions/dashboard/note'
import { noteSchema, NoteSchemaType } from '@/schemas/dashboard/note'
import { NoteAction, NoteStatus, NoteTag } from '@/lib/generated/prisma'

const BlockNoteEditor = dynamic(() => import('@/components/tools/blocknote-editor'), {
  ssr: false,
})

const CreateNoteForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   block note states
  const [noteContent, setNoteContent] = useState('')
  //   Form Zod validation.
  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      tag: 'note',
      status: 'draft',
      action: 'important',
      published: false,
    },
  })
  //   call server action to submit form
  function onSubmit(values: NoteSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createNoteAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/documents/notes')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Planning note" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          {/* tag */}
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note Tag</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tag" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tag</SelectLabel>
                      {Object.keys(NoteTag).map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {Object.keys(NoteStatus).map((status) => (
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
          {/* action */}
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a action" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Action</SelectLabel>
                      {Object.keys(NoteAction).map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
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
            name="published"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Published</FormLabel>

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
                    {field.value ? 'Yes' : 'No'}
                  </Label>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* content */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note Title</FormLabel>
              <FormControl>
                <BlockNoteEditor
                  initialContent={field.value}
                  onChange={(val) => {
                    setNoteContent(val)
                    field.onChange(val)
                  }}
                />
              </FormControl>
              <Textarea hidden name={field.name} value={noteContent} onChange={() => {}} />

              <FormDescription>
                Rich text editing right at your finger tips type / for commands
              </FormDescription>
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
              Create Note
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateNoteForm
