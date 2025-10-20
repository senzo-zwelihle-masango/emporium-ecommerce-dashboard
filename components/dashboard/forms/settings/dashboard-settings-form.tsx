'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { SaveAllIcon } from 'lucide-react'

import { toast } from 'sonner'

import { tryCatch } from '@/hooks/use-try-catch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

import { adminSettingsSchema, AdminSettingsSchemaType } from '@/schemas/dashboard/settings'

import { updateAdminSettingsAction } from '@/server/actions/dashboard/settings'

interface AdminSettingsFormProps {
  initialSettings?: AdminSettingsSchemaType
}

export const AdminSettingsForm = ({ initialSettings }: AdminSettingsFormProps) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<AdminSettingsSchemaType>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: initialSettings || {
      siteName: 'Elysian Emporium',
      siteDescription: 'A modern ecommerce platform',
      contactEmail: 'support@elysianemporium.com',
      maintenanceMessage:
        'We are currently performing scheduled maintenance. Please check back soon.',
      userRegistration: true,
      emailNotifications: true,
      twoFactorAuth: false,
      loginAttemptLimit: true,
    },
  })

  async function onSubmit(values: AdminSettingsSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateAdminSettingsAction(values))

      if (error) {
        toast.error('Unexpected error occurred. Please try again.')
        return
      }

      if (result.status === 'success') {
        toast.success(result.message)
        form.reset(values)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>Configure general site-wide settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="siteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>The name of your website</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="siteDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>A short description of your website for SEO</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormDescription>Email address for customer support inquiries</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maintenanceMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Message</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Message displayed to visitors during maintenance
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="userRegistration"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>User Registration</FormLabel>
                      <FormDescription>Allow new user registrations</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailNotifications"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Email Notifications</FormLabel>
                      <FormDescription>Send system-wide email notifications</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twoFactorAuth"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Two-Factor Authentication</FormLabel>
                      <FormDescription>Require 2FA for admin accounts</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="loginAttemptLimit"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div>
                      <FormLabel>Login Attempt Limit</FormLabel>
                      <FormDescription>Limit failed login attempts</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  Saving...
                  <Spinner />
                </>
              ) : (
                <>
                  Save Changes
                  <SaveAllIcon className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
