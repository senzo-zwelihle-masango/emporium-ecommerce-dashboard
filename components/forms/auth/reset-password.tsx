'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'

import { cn } from '@/lib/utils'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

import { authClient } from '@/lib/auth-client'

import { resetPasswordFormSchema } from '@/schemas/auth/reset-password'

const ResetPasswordForm = ({ className, ...props }: React.ComponentProps<'form'>) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token') as string

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof resetPasswordFormSchema>) {
    setIsLoading(true)

    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset successfully')
      router.push('/sign-in')
    }

    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your new password below to
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Reset Password'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </Form>
  )
}

export default ResetPasswordForm
