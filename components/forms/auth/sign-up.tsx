'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

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
import { GoogleIcon } from '@/components/icons/google'
import { GitHubIcon } from '@/components/icons/github'
import { Spinner } from '@/components/ui/spinner'

import { signUpAction } from '@/server/actions/auth/user'
import { signUpFormSchema } from '@/schemas/auth/sign-up'
import { DiscordIcon } from '@/components/icons/discord'

const SignUpForm = ({ className, ...props }: React.ComponentProps<'form'>) => {
  // form/social states
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [gitHubPending, startGitHubTransition] = useTransition()
  const [googlePending, startGoogleTransition] = useTransition()
  const [discordPending, startDiscordTransition] = useTransition()

  // validation
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  // submit form
  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {
    setIsLoading(true)

    const { success, message } = await signUpAction(values.email, values.password, values.username)

    if (success) {
      toast.success(`${message as string} Please check your email for verification.`)
      router.push('/')
    } else {
      toast.error(message as string)
    }

    setIsLoading(false)
  }

  // social sign up
  const signUpWithGitHub = () => {
    startGitHubTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed up successfully')
          },
          onError: () => {
            toast.error(' Internal Server Error ')
          },
        },
      })
    })
  }

  const signUpWithGoogle = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed up successfully...')
          },
          onError: () => {
            toast.error(' Internal Server Error ')
          },
        },
      })
    })
  }

  const signUpWithDiscord = () => {
    startDiscordTransition(async () => {
      await authClient.signIn.social({
        provider: 'discord',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            toast.success('Signed up successfully...')
          },
          onError: () => {
            toast.error(' Internal Server Error ')
          },
        },
      })
    })
  }
  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        onSubmit={form.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to create a new account
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner /> : 'Sign Up'}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={signUpWithGoogle}
              disabled={googlePending}
            >
              {googlePending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <GoogleIcon className="size-4" />
                  Google
                </>
              )}
            </Button>

            <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={signUpWithGitHub}
              disabled={gitHubPending}
            >
              {gitHubPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <GitHubIcon className="size-3.5" />
                  GitHub
                </>
              )}
            </Button>

             <Button
              variant="outline"
              type="button"
              className="w-full"
              onClick={signUpWithDiscord}
              disabled={discordPending}
            >
              {discordPending ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <DiscordIcon className="size-3.5" />
                  Discord
                </>
              )}
            </Button>
          </div>
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

export default SignUpForm
