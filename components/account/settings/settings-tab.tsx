'use client'

import React from 'react'
import Link from 'next/link'
import {
  UserIcon,
  BellIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  DatabaseIcon,
  TrashIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const SettingsTab = () => {
  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Update your personal information and profile picture',
      icon: UserIcon,
      link: '/account/settings',
      buttonLabel: 'Manage Profile',
    },
    {
      title: 'Notification Preferences',
      description: 'Choose which emails and notifications you want to receive',
      icon: BellIcon,
      link: '/account/settings#notifications',
      buttonLabel: 'Configure',
    },
    {
      title: 'Payment Methods',
      description: 'Manage your saved payment methods and billing information',
      icon: CreditCardIcon,
      link: '/account/settings#payment',
      buttonLabel: 'Manage Payments',
    },
    {
      title: 'Security Settings',
      description: 'Configure two-factor authentication and password settings',
      icon: ShieldCheckIcon,
      link: '/account/settings#security',
      buttonLabel: 'Enhance Security',
    },
    {
      title: 'Data & Privacy',
      description: 'Export your data or manage privacy preferences',
      icon: DatabaseIcon,
      link: '/account/settings#privacy',
      buttonLabel: 'Manage Data',
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and all associated data',
      icon: TrashIcon,
      link: '/account/settings#delete',
      buttonLabel: 'Delete Account',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Account Settings</h3>
        <p className="text-muted-foreground">
          Manage your account preferences and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsSections.map((section, index) => {
          const Icon = section.icon
          return (
            <Card key={index} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Icon className="text-primary h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{section.description}</CardDescription>
                <Button asChild variant="outline" size="sm">
                  <Link href={section.link}>{section.buttonLabel}</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
