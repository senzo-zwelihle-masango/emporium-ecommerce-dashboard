import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Container } from '@/components/ui/container'

import { auth } from '@/lib/auth'

import ProfileCard from '@/components/account/profile-card'
import AccountOverview from '@/components/account/account-overview'

import { fetchUserAccountData } from '@/server/actions/user/data'
import { fetchAccountOverview } from '@/server/actions/user/overview'

const AccountPage = async () => {
  // check user session
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const [userData, overviewData] = await Promise.all([
    fetchUserAccountData(),
    fetchAccountOverview(),
  ])

  if (!userData || !overviewData) {
    redirect('/sign-in')
  }
  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'screen'}
      padding={'px-md'}
      gap={'none'}
      flow={'none'}
      id="account"
      className="space-y-6 pt-24"
    >
      {/* header */}
      <ProfileCard
        name={
          session?.user.name && session.user.name.length > 0
            ? session.user.name
            : session?.user.email.split('@')[0]
        }
        email={session.user.email}
        emailVerified={session.user.emailVerified}
        image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
        role={session.user.role ?? 'user'}
      />

      {/* main */}
      <AccountOverview userData={userData} overviewData={overviewData} />
    </Container>
  )
}

export default AccountPage
