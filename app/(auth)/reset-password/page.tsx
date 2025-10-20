import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { auth } from '@/lib/auth'

import ResetPasswordForm from '@/components/forms/auth/reset-password'

import ElysianEmporiumSignUpDark from '@/public/images/sign-up-design-dark.png'
import ElysianEmporiumSignUpLight from '@/public/images/sign-up-design-light.png'
import ElysianEmporiumLogo from '@/components/ui/emporium-ecommerce-svg'

const ResetPasswordPage = async () => {
  // check user session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if theres a session redirect to  root page
  if (session) {
    return redirect('/')
  }
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center">
              <ElysianEmporiumLogo className="size-8 rounded-sm" />
            </div>
            Elysian Emporium Store.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src={ElysianEmporiumSignUpDark}
          alt="Elysian logo"
          className="absolute inset-0 h-full w-full object-cover dark:hidden"
        />
        <Image
          src={ElysianEmporiumSignUpLight}
          alt="Elysian logo"
          className="absolute inset-0 hidden h-full w-full object-cover dark:block"
        />
      </div>
    </div>
  )
}

export default ResetPasswordPage
