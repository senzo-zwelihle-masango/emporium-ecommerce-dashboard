'use client'

import React, { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { GoogleIcon } from '@/components/icons/google'
import { GitHubIcon } from '@/components/icons/github'
import { Input } from '@/components/ui/input'

import { authClient } from '@/lib/auth-client'

import { signInAction } from '@/server/actions/auth/user'
import { signInFormSchema } from '@/schemas/auth/sign-in'

import ElysianEmporiumSignInDark from '@/public/images/sign-up-design-dark.png'
import ElysianEmporiumSignInLight from '@/public/images/sign-up-design-light.png'
import { DiscordIcon } from '@/components/icons/discord'

const SignInForm = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [gitHubPending, startGitHubTransition] = useTransition()
  const [googlePending, startGoogleTransition] = useTransition()
  const [discordPending, startDiscordTransition] = useTransition()

  // last login method state
  const [lastLoginMethod, setLastLoginMethod] = useState<string | null>(null)

  useEffect(() => {
    const storedMethod = localStorage.getItem('lastLoginMethod')
    if (storedMethod) {
      setLastLoginMethod(storedMethod)
    }
  }, [])

  // validation
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // submit form (email/password)
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    setIsLoading(true)

    const { success, message } = await signInAction(values.email, values.password)

    if (success) {
      localStorage.setItem('lastLoginMethod', 'password')
      toast.success(message as string)
      router.push('/')
    } else {
      toast.error(message as string)
    }

    setIsLoading(false)
  }

  // social sign in
  const signInWithGitHub = () => {
    startGitHubTransition(async () => {
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            localStorage.setItem('lastLoginMethod', 'github')
            toast.success('Signed in successfully')
          },
          onError: () => {
            toast.error(' Internal Server Error ')
          },
        },
      })
    })
  }

  const signInWithGoogle = () => {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            localStorage.setItem('lastLoginMethod', 'google')
            toast.success('Signed in successfully...')
          },
          onError: () => {
            toast.error(' Internal Server Error ')
          },
        },
      })
    })
  }

  const signInWithDiscord = () => {
    startDiscordTransition(async () => {
      await authClient.signIn.social({
        provider: 'discord',
        callbackURL: '/',
        fetchOptions: {
          onSuccess: () => {
            localStorage.setItem('lastLoginMethod', 'google')
            toast.success('Signed in successfully...')
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
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        <Card className="bg-background overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">Sign into your account</p>
                </div>

                {/* Email field */}
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

                {/* Password field */}
                <div className="grid gap-3">
                  <div className="flex flex-col gap-2">
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
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="relative">
                  {' '}
                  {/* Email/Password Sign In */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner />
                    ) : (
                      <>
                        Sign In
                        {lastLoginMethod === 'email' && (
                          <Badge
                            variant="default"
                            className="absolute top-0 right-0 translate-x-1 -translate-y-1 text-[10px]"
                          >
                            Last used
                          </Badge>
                        )}
                      </>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Google */}
                  <div className="relative">
                    {lastLoginMethod === 'google' && (
                      <Badge
                        variant="default"
                        className="absolute top-0 right-0 translate-x-1 -translate-y-1 text-[10px]"
                      >
                        Last used
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={signInWithGoogle}
                      disabled={googlePending}
                    >
                      {googlePending ? (
                        <Spinner />
                      ) : (
                        <>
                          <GoogleIcon />
                          Google
                        </>
                      )}
                    </Button>
                  </div>

                  {/* GitHub */}
                  <div className="relative">
                    {lastLoginMethod === 'github' && (
                      <Badge
                        variant="default"
                        className="absolute -top-3 right-2 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        Last used
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={signInWithGitHub}
                      disabled={gitHubPending}
                    >
                      {gitHubPending ? (
                        <Spinner />
                      ) : (
                        <>
                          <GitHubIcon />
                          GitHub
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    {lastLoginMethod === 'discord' && (
                      <Badge
                        variant="default"
                        className="absolute -top-3 right-2 rounded-full px-2 py-0.5 text-[10px]"
                      >
                        Last used
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full"
                      onClick={signInWithDiscord}
                      disabled={discordPending}
                    >
                      {discordPending ? (
                        <Spinner />
                      ) : (
                        <>
                          <DiscordIcon />
                          Discord
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link href="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>

            {/* Side Image */}
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

        {/* Terms */}
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
          By clicking continue, you agree to our <Link href="#">Terms of Service</Link> and{' '}
          <Link href="#">Privacy Policy</Link>.
        </div>
      </div>
    </Form>
  )
}

export default SignInForm
