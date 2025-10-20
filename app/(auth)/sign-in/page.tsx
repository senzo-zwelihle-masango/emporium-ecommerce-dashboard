import React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import SignInForm from '@/components/forms/auth/sign-in'

const SignInPage = async () => {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (session) {
    return redirect('/')
  }
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignInForm />
      </div>
    </div>
  )
}

export default SignInPage
