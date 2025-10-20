'use client'

import React from 'react'
import { ArrowRightIcon, BellIcon, CreditCardIcon, UserPlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  features?: string[]
  comingSoon?: boolean
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  features = [],
  comingSoon = false,
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center space-y-6 px-4 py-12 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full">
      <Icon />
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-center gap-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        {comingSoon && (
          <Badge variant="secondary" className="text-xs">
            Coming Soon
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>

    {features.length > 0 && (
      <div className="space-y-2">
        <p className="text-sm font-medium">Features you&apos;ll get:</p>
        <ul className="text-muted-foreground space-y-1 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <ArrowRightIcon />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    )}

    {actionLabel && !comingSoon && (
      <Button onClick={onAction} className="min-w-32">
        {actionLabel}
      </Button>
    )}

    {comingSoon && (
      <div className="flex flex-col items-center gap-2">
        <Button variant="outline" disabled={!onAction} onClick={onAction} className="min-w-32">
          <UserPlusIcon />
          {actionLabel || 'Notify Me'}
        </Button>
        <p className="text-muted-foreground text-xs">
          We&apos;ll let you know when this feature is ready
        </p>
      </div>
    )}
  </div>
)

export const NotificationsTab = () => {
  const handleNotifyMe = () => {
    alert("Thanks! We'll notify you when this feature is available.")
  }

  return (
    <EmptyState
      icon={BellIcon}
      title="Smart Notifications"
      description="Stay informed with real-time updates about your orders, exclusive deals, and account activity. Never miss a beat with our intelligent notification system."
      features={[
        'Instant order status updates',
        'Personalized deal alerts',
        'Security & privacy notifications',
        'AI-powered product recommendations',
        'Price drop alerts for favorites',
        'Customizable notification preferences',
      ]}
      actionLabel="Notify When Ready"
      onAction={handleNotifyMe}
      comingSoon={true}
    />
  )
}

export const PaymentTab = () => {
  const handleNotifyPayment = () => {
    alert("We'll notify you when secure payment management is available!")
  }

  return (
    <EmptyState
      icon={CreditCardIcon}
      title="Secure Payment Hub"
      description="Manage all your payment methods in one secure location. Save time at checkout and keep your financial information safe with our encrypted payment system."
      features={[
        'Bank-level security encryption',
        'Multiple payment method support',
        'One-click checkout experience',
        'Detailed payment history',
        'Automatic fraud protection',
        'Subscription management',
      ]}
      actionLabel="Get Notified"
      onAction={handleNotifyPayment}
      comingSoon={true}
    />
  )
}
