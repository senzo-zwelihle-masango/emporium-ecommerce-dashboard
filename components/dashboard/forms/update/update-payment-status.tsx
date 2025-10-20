'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { CreditCardIcon } from 'lucide-react'

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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { updatePaymentStatusSchema, UpdatePaymentStatusSchemaType } from '@/schemas/dashboard/order'
import { PaymentStatus } from '@/lib/generated/prisma'
import { updatePaymentStatusAction } from '@/server/actions/dashboard/order'

interface UpdatePaymentStatusFormProps {
  orderId: string
  currentPaymentStatus: PaymentStatus
  onSuccess?: () => void
}

const UpdatePaymentStatusForm = ({
  orderId,
  currentPaymentStatus,
  onSuccess,
}: UpdatePaymentStatusFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<UpdatePaymentStatusSchemaType>({
    resolver: zodResolver(updatePaymentStatusSchema),
    defaultValues: {
      paymentStatus: currentPaymentStatus,
      transactionId: null,
      paymentGatewayId: null,
    },
  })

  function onSubmit(values: UpdatePaymentStatusSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updatePaymentStatusAction(orderId, values))

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        onSuccess?.()
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="paymentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PaymentStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter transaction ID" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentGatewayId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Gateway ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter payment gateway ID"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner />
              Updating...
            </>
          ) : (
            <>
              <CreditCardIcon className="h-4 w-4" />
              Update Payment Status
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdatePaymentStatusForm
