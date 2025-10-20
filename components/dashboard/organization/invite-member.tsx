'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { tryCatch } from '@/hooks/use-try-catch'
import { Spinner } from '@/components/ui/spinner'
import { InviteMemberSchemaType, inviteMemberSchema } from '@/schemas/dashboard/organization'
import { inviteMemberAction } from '@/server/actions/dashboard/organization'

const InviteMemberForm = ({ organizationId }: { organizationId: string }) => {
  // Form states
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  //   Form Zod validation.
  const form = useForm<InviteMemberSchemaType>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  })
  //   call server action to submit form
  function onSubmit(values: InviteMemberSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(inviteMemberAction(organizationId, values))

      if (error) {
        toast.error('Unexpected error occurred. please try again')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset()
        router.push('/dashboard/organization')
      } else if (result.status === 'error') {
        toast.error(result.message)
      }
    })
  }
  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              Please wait...
              <Spinner />
            </>
          ) : (
            <>
              Add Member
              <PlusIcon />
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default InviteMemberForm
