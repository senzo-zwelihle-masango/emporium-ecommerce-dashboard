import { z } from 'zod'

export const adminSettingsSchema = z.object({
  siteName: z
    .string()
    .min(1, 'Site name is required')
    .max(50, 'Site name must be under 50 characters.'),
  siteDescription: z.string().max(200, 'Site description must be under 200 characters.').optional(),
  contactEmail: z.email('Invalid email address'),
  maintenanceMessage: z
    .string()
    .max(300, 'Maintenance message must be under 300 characters.')
    .optional(),
  userRegistration: z.boolean().optional(),
  emailNotifications: z.boolean().optional(),
  twoFactorAuth: z.boolean().optional(),
  loginAttemptLimit: z.boolean().optional(),
})

export const maintenanceSchema = z.object({
  enabled: z.boolean(),
  message: z.string().max(300, 'Maintenance message must be under 300 characters.').optional(),
})

export type AdminSettingsSchemaType = z.infer<typeof adminSettingsSchema>
export type MaintenanceSchemaType = z.infer<typeof maintenanceSchema>
