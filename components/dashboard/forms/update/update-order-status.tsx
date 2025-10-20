'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { toast } from 'sonner'

import { SaveIcon, CalendarIcon } from 'lucide-react'

import { format } from 'date-fns'

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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Spinner } from '@/components/ui/spinner'

import { tryCatch } from '@/hooks/use-try-catch'

import { updateOrderStatusSchema, UpdateOrderStatusSchemaType } from '@/schemas/dashboard/order'
import { OrderStatus } from '@/lib/generated/prisma'
import { updateOrderStatusAction } from '@/server/actions/dashboard/order'

interface UpdateOrderStatusFormProps {
  orderId: string
  currentStatus: OrderStatus
  onSuccess?: () => void
}

const UpdateOrderStatusForm = ({
  orderId,
  currentStatus,
  onSuccess,
}: UpdateOrderStatusFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<UpdateOrderStatusSchemaType>({
    resolver: zodResolver(updateOrderStatusSchema),
    defaultValues: {
      status: currentStatus,
      transactionId: null,
      paymentGatewayId: null,
      cancellationReason: null,
      actualDeliveryDate: null,
      expectedDeliveryDate: null,
    },
  })

  const watchedStatus = form.watch('status')

  function onSubmit(values: UpdateOrderStatusSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateOrderStatusAction(orderId, values))

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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(OrderStatus).map((status) => (
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

        {watchedStatus === 'cancelled' && (
          <FormField
            control={form.control}
            name="cancellationReason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancellation Reason</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter reason for cancellation"
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="expectedDeliveryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected Delivery Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant="outline" className="w-full pl-3 text-left font-normal">
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value || undefined}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchedStatus === 'delivered' && (
          <FormField
            control={form.control}
            name="actualDeliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Actual Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="w-full pl-3 text-left font-normal">
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Spinner />
              Updating...
            </>
          ) : (
            <>
              <SaveIcon className="h-4 w-4" />
              Update Status
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default UpdateOrderStatusForm
