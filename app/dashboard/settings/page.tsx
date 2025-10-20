import React from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { SystemStats } from '@/components/dashboard/setting/system-stats'
import { MaintenanceModeToggle } from '@/components/dashboard/setting/maintenance-mode'
import { AdminSettingsForm } from '@/components/dashboard/forms/settings/dashboard-settings-form'
import { getAdminSettingsAction } from '@/server/actions/dashboard/settings'
import { getMaintenanceModeAction } from '@/server/actions/dashboard/maintenance'

const AdminSettingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth/sign-in')
  }

  // Check if user is admin
  if (session.user.role !== 'admin' && session.user.role !== 'owner') {
    redirect('/unauthorized')
  }

  // Get system stats and settings
  const userCount = await prisma.user.count()
  const orderCount = await prisma.order.count()
  const productCount = await prisma.product.count()

  const [currentSettings, maintenanceMode] = await Promise.all([
    getAdminSettingsAction(),
    getMaintenanceModeAction(),
  ])

  return (
    <Container
      size={'2xl'}
      alignment={'none'}
      height={'full'}
      padding={'px-sm'}
      gap={'none'}
      flow={'none'}
      id="admin-settings"
      className="my-4"
    >
      <div className="space-y-6">
        <div>
          <Heading
            size={'5xl'}
            spacing={'normal'}
            lineHeight={'none'}
            weight={'bold'}
            margin={'none'}
          >
            Admin Settings
          </Heading>
          <p className="text-muted-foreground">Manage system-wide settings and configurations</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Settings Content */}
          <div className="space-y-6 lg:col-span-2">
            <AdminSettingsForm initialSettings={currentSettings} />

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure global system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-muted-foreground text-sm">
                      Temporarily disable the storefront for maintenance
                    </p>
                  </div>
                  <MaintenanceModeToggle initialEnabled={maintenanceMode.enabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>User Registration</Label>
                    <p className="text-muted-foreground text-sm">Allow new user registrations</p>
                  </div>
                  <Switch defaultChecked={currentSettings.userRegistration} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-muted-foreground text-sm">
                      Send system-wide email notifications
                    </p>
                  </div>
                  <Switch defaultChecked={currentSettings.emailNotifications} disabled />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security-related settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-muted-foreground text-sm">Require 2FA for admin accounts</p>
                  </div>
                  <Switch defaultChecked={currentSettings.twoFactorAuth} disabled />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Login Attempt Limit</Label>
                    <p className="text-muted-foreground text-sm">Limit failed login attempts</p>
                  </div>
                  <Switch defaultChecked={currentSettings.loginAttemptLimit} disabled />
                </div>

                <Button variant="outline" className="w-full" disabled>
                  Configure IP Whitelisting
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <SystemStats
              userCount={userCount}
              orderCount={orderCount}
              productCount={productCount}
            />

            <Card>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" disabled>
                  Clear Cache
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Rebuild Search Index
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  System Logs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full" disabled>
                  API Keys
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Rate Limiting
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  Webhook Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default AdminSettingsPage
