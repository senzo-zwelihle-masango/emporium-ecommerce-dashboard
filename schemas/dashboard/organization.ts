import { z } from 'zod'

export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization Name is required')
    .max(50, 'Name must be under 50 characters.'),
  slug: z.string().max(30, 'Slug must be under 30 characters.').optional(),
  logo: z.string().optional(),
})

export const inviteMemberSchema = z.object({
  email: z.email('Invalid email address'),
  role: z.string().min(1, 'Membership Role is required'),
})

export const updateMemberRoleSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
  role: z.string().min(1, 'Role is required'),
})

export const removeMemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required to remove a member'),
})

export const switchOrganizationSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
})

export type OrganizationSchemaType = z.infer<typeof organizationSchema>

export type InviteMemberSchemaType = z.infer<typeof inviteMemberSchema>

export type UpdateMemberRoleSchemaType = z.infer<typeof updateMemberRoleSchema>

export type RemoveMemberSchemaType = z.infer<typeof removeMemberSchema>

export type SwitchOrganizationSchemaType = z.infer<typeof switchOrganizationSchema>
