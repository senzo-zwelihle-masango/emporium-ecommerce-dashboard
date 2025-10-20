'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

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
import { Textarea } from '@/components/ui/textarea'

import { tryCatch } from '@/hooks/use-try-catch'

import { warehouseSchema, WarehouseSchemaType } from '@/schemas/dashboard/warehouse'
import { WarehouseStatus } from '@/lib/generated/prisma'
import { createNewWarehouseAction } from '@/server/actions/dashboard/warehouse'

const CreateWarehouseForm = () => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  //   Form Zod validation.
  const form = useForm<WarehouseSchemaType>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      status: 'active',
    },
  })
  //   call server action to submit form
  function onSubmit(values: WarehouseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createNewWarehouseAction(values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/warehouses')
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
                <Input placeholder="e.g. CPT" {...field} />
              </FormControl>
              <FormDescription>This is the public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Cape Town" {...field} />
              </FormControl>
              <FormDescription>This is the public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g. Description" {...field} />
              </FormControl>

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
                    {Object.keys(WarehouseStatus).map((status) => (
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

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner />
              Please wait...
            </>
          ) : (
            <>
              <PlusIcon />
              Create Warehouse
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default CreateWarehouseForm
