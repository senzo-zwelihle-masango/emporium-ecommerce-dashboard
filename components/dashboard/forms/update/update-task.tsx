'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { SaveAllIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { taskSchema, TaskSchemaType } from '@/schemas/dashboard/task'
import { TaskPriority, TaskStatus } from '@/lib/generated/prisma'
import { updateTaskAction } from '@/server/actions/dashboard/task'

export interface UpdateTaskFormProps {
  task: {
    id: string
    title: string
    label: string
    status: string
    priority: string
  }
}
const UpdateTaskForm = ({ task }: UpdateTaskFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  //   Form Zod validation.
  const form = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      status: task.status as TaskSchemaType['status'],
      label: task.label,
      priority: task.priority as TaskSchemaType['priority'],
    },
  })
  //   call server action to submit form
  function onSubmit(values: TaskSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateTaskAction(values, task.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/documents/tasks')
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
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Update Products" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* label */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Label</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Feature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
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
                      <SelectValue placeholder="Select a task status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {Object.keys(TaskStatus).map((status) => (
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
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Object.keys(TaskPriority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <SaveAllIcon />
              Update Task
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateTaskForm
