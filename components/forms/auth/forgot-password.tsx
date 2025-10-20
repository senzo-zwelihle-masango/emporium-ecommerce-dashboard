'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import { LoaderIcon } from 'lucide-react'

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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import { authClient } from '@/lib/auth-client'
import { forgotPasswordFormSchema } from '@/schemas/auth/forgot-password'

import ElysianEmporiumSignInDark from '@/public/images/sign-up-design-dark.png'
import ElysianEmporiumSignInLight from '@/public/images/sign-up-design-light.png'

const ForgotPasswordForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  // form/socialstates

  const [isLoading, setIsLoading] = useState(false)

  // validation
  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  })

  // submit form

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    setIsLoading(true)

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: '/reset-password',
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password reset email sent')
    }

    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="bg-background overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">
                    Enter your email to reset your password
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoaderIcon className="size-4 animate-spin" /> : 'Reset Password'}
                </Button>

                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
            <div className="bg-muted relative hidden md:block">
              <Image
                src={ElysianEmporiumSignInDark}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:hidden"
              />
              <Image
                src={ElysianEmporiumSignInLight}
                alt="Image"
                className="absolute inset-0 hidden h-full w-full object-cover dark:block"
              />
            </div>
          </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
          <Link href="#">Privacy Policy</Link>.
        </div>
      </div>
    </Form>
  )
}

export default ForgotPasswordForm
