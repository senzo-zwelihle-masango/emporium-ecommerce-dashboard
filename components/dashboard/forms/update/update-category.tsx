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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { categorySchema, CategorySchemaType } from '@/schemas/dashboard/category'
import { updateCategoryAction } from '@/server/actions/dashboard/category'

export interface UpdateCategoryFormProps {
  category: {
    id: string
    name: string
    active: boolean
  }
}

const UpdateCategoryForm = ({ category }: UpdateCategoryFormProps) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   Form Zod validation.
  const form = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
      active: category.active,
    },
  })
  //   call server action to submit form
  function onSubmit(values: CategorySchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateCategoryAction(values, category.id))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/categories')
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
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Electronics" {...field} />
              </FormControl>
              <FormDescription>This is the public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* active */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm">Active</FormLabel>

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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <SaveAllIcon />
              Update Category
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateCategoryForm
