'use client'

import React from 'react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PulseAnimation from '@/components/ui/pulse'

interface ProfileCardProps {
  name: string
  email: string
  emailVerified: boolean
  image: string
  role: string
}

const ProfileCard = ({ name, emailVerified, image, role }: ProfileCardProps) => {
  const isAdministrator = role === 'admin'

  const setContent = () => {
    return isAdministrator
      ? "Manage products, view orders, and analyze your store's performance."
      : 'Browse products, track your orders, and manage your account settings.'
  }

  // time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return 'Good morning'
    } else if (hour < 18) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }

  //   set buttons based on role
  const getButtons = () => {
    return isAdministrator
      ? [
          {
            label: 'Products',
            variant: 'default' as const,
            href: '/admin/products',
          },
          {
            label: 'Orders',
            variant: 'outline' as const,
            href: '/admin/orders',
          },
        ]
      : [
          { label: 'Shop Now', variant: 'default' as const, href: '/products' },
          {
            label: 'My Orders',
            variant: 'outline' as const,
            href: '/account/orders',
          },
          {
            label: 'Settings',
            variant: 'outline' as const,
            href: '/account/settings',
          },
        ]
  }
  return (
    <div className="overflow-hidden rounded-xl pt-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-4">
          {/* user */}
          <div className="relative inline-flex">
            <Avatar>
              <AvatarImage src={image} alt="User Image" className="h-8 w-8" />
              <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
            </Avatar>

            {emailVerified && (
              <span className="absolute -end-1.5 -top-1.5">
                <span className="sr-only">Verified</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    className="fill-background"
                    d="M3.046 8.277A4.402 4.402 0 0 1 8.303 3.03a4.4 4.4 0 0 1 7.411 0 4.397 4.397 0 0 1 5.19 3.068c.207.713.23 1.466.067 2.19a4.4 4.4 0 0 1 0 7.415 4.403 4.403 0 0 1-3.06 5.187 4.398 4.398 0 0 1-2.186.072 4.398 4.398 0 0 1-7.422 0 4.398 4.398 0 0 1-5.257-5.248 4.4 4.4 0 0 1 0-7.437Z"
                  />
                  <path
                    className="fill-primary"
                    d="M4.674 8.954a3.602 3.602 0 0 1 4.301-4.293 3.6 3.6 0 0 1 6.064 0 3.598 3.598 0 0 1 4.3 4.302 3.6 3.6 0 0 1 0 6.067 3.6 3.6 0 0 1-4.29 4.302 3.6 3.6 0 0 1-6.074 0 3.598 3.598 0 0 1-4.3-4.293 3.6 3.6 0 0 1 0-6.085Z"
                  />
                  <path
                    className="fill-background"
                    d="M15.707 9.293a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 1 1 1.414-1.414L11 12.586l3.293-3.293a1 1 0 0 1 1.414 0Z"
                  />
                </svg>
              </span>
            )}
          </div>
          <h3 className="text-3xl">
            {getGreeting()}: {name}
          </h3>
          <p>{setContent()}</p>
          <div className="flex flex-wrap gap-3">
            {getButtons().map((button, index) => (
              <Button key={index} variant={button.variant} asChild>
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        </div>
        <PulseAnimation />
      </div>
    </div>
  )
}

export default ProfileCard
