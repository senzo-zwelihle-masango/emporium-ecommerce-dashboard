'use client'

import React, { useTransition } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { tryCatch } from '@/hooks/use-try-catch'
import { updateOrganizationAction } from '@/server/actions/dashboard/organization'
import { organizationSchema, OrganizationSchemaType } from '@/schemas/dashboard/organization'

type UpdateOrganizationFormProps = {
  organization: {
    id: string
    name: string
  }
}

const UpdateOrganizationForm = ({ organization }: UpdateOrganizationFormProps) => {
  const [isPending, startTransition] = useTransition()

  const form = useForm<OrganizationSchemaType>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: organization.name,
    },
  })

  const onSubmit = (values: OrganizationSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateOrganizationAction(values, organization.id)
      )

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Updating...
              <Spinner />
            </>
          ) : (
            'Update Organization'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateOrganizationForm
