'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma/client'

import { ApiResponse, ApiResponseWithData } from '@/types/api/response'

import { createNotificationAction } from '@/server/actions/notification/notifications'
import { NotificationType } from '@/lib/generated/prisma'

import {
  organizationSchema,
  OrganizationSchemaType,
  InviteMemberSchemaType,
  inviteMemberSchema,
  UpdateMemberRoleSchemaType,
  updateMemberRoleSchema,
  RemoveMemberSchemaType,
  removeMemberSchema,
  SwitchOrganizationSchemaType,
  switchOrganizationSchema,
} from '@/schemas/dashboard/organization'

// new
export async function createOrganizationAction(
  values: OrganizationSchemaType
): Promise<ApiResponseWithData<{ id: string; name: string }>> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = organizationSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    // Check if organization with this name already exists for this user
    const existingOrg = await prisma.organization.findFirst({
      where: {
        name: validation.data.name,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (existingOrg) {
      return {
        status: 'error',
        message: 'Organization with this name already exists',
      }
    }

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        name: validation.data.name,
        slug: validation.data.slug || undefined,
        logo: validation.data.logo || undefined,
        members: {
          create: {
            userId: session.user.id,
            role: 'owner',
          },
        },
      },
    })

    // Update user's active organization if it's their first
    const userOrganizations = await prisma.organization.count({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    })

    if (userOrganizations === 1) {
      await prisma.session.updateMany({
        where: {
          userId: session.user.id,
        },
        data: {
          activeOrganizationId: organization.id,
        },
      })
    }

    revalidatePath('/admin')
    return {
      status: 'success',
      message: 'Organization created successfully',
      data: organization,
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to create organization: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// update
export async function updateOrganizationAction(
  data: OrganizationSchemaType,
  organizationId: string
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // schema validation
    const result = organizationSchema.safeParse(data)

    if (!result.success) {
      return {
        status: 'error',
        message: 'Invalid form data',
      }
    }

    // mutation
    const updateOrganization = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        ...result.data,
      },
    })

    await createNotificationAction(
      `Successfully updated "${updateOrganization.name}" organization.`,
      NotificationType.success,
      updateOrganization.id,
      'Organization',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Organization Updated Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to update organization. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to update organization',
    }
  }
}

// delete
export async function deleteOrganizationAction(organizationId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // mutation
    const deleteOrganization = await prisma.organization.delete({
      where: {
        id: organizationId,
      },
    })

    await createNotificationAction(
      `Successfully deleted "${deleteOrganization.name}" organization.`,
      NotificationType.success,
      deleteOrganization.id,
      'Organization',
      session.user.id
    )
    return {
      status: 'success',
      message: 'Organization Deleted Successfully',
    }
  } catch (error) {
    await createNotificationAction(
      `Failed to delete organization. Error: ${error instanceof Error ? error.message : String(error)}`,
      NotificationType.error,
      undefined,
      undefined,
      session.user.id
    )
    return {
      status: 'error',
      message: 'Failed to delete organization',
    }
  }
}

// invite
export async function inviteMemberAction(
  organizationId: string,
  values: InviteMemberSchemaType
): Promise<ApiResponseWithData<{ id: string; email: string }>> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = inviteMemberSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    // Check if user is a member of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return {
        status: 'error',
        message: 'You are not a member of this organization',
      }
    }

    // Check if user has permission to invite members (must be owner or admin)
    if (member.role !== 'owner' && member.role !== 'admin') {
      return {
        status: 'error',
        message: "You don't have permission to invite members",
      }
    }

    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        user: {
          email: validation.data.email,
        },
      },
    })

    if (existingMember) {
      return {
        status: 'error',
        message: 'User is already a member of this organization',
      }
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId: organizationId,
        email: validation.data.email,
      },
    })

    if (existingInvitation) {
      return {
        status: 'error',
        message: 'User has already been invited to this organization',
      }
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        organizationId: organizationId,
        email: validation.data.email,
        role: validation.data.role,
        status: 'pending',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        inviterId: session.user.id,
      },
    })

    // Get organization name for notification
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    })

    // Create notification for the invited user if they exist
    const invitedUser = await prisma.user.findUnique({
      where: {
        email: validation.data.email,
      },
    })

    if (invitedUser && organization) {
      await createNotificationAction(
        `You have been invited to join ${organization.name}`,
        NotificationType.information,
        invitation.id,
        'Invitation',
        invitedUser.id
      )
    }

    revalidatePath('/admin')
    return {
      status: 'success',
      message: 'Member invited successfully',
      data: invitation,
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to invite member: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Accept invitation
export async function acceptInvitationAction(
  invitationId: string
): Promise<ApiResponseWithData<{ id: string; role: string }>> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    })

    if (!invitation) {
      return { status: 'error', message: 'Invitation not found' }
    }

    if (invitation.email !== session.user.email) {
      return { status: 'error', message: 'This invitation is not for you' }
    }

    if (invitation.status !== 'pending') {
      return { status: 'error', message: 'This invitation is no longer valid' }
    }

    if (invitation.expiresAt < new Date()) {
      return { status: 'error', message: 'This invitation has expired' }
    }

    // Check if user is already a member
    const existingMember = await prisma.member.findFirst({
      where: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
      },
    })

    if (existingMember) {
      // Delete the invitation since user is already a member
      await prisma.invitation.delete({
        where: {
          id: invitationId,
        },
      })
      return {
        status: 'error',
        message: 'You are already a member of this organization',
      }
    }

    // Create member
    const member = await prisma.member.create({
      data: {
        organizationId: invitation.organizationId,
        userId: session.user.id,
        role: invitation.role || 'member',
      },
    })

    // Update invitation status
    await prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: 'accepted',
      },
    })

    // Get organization name for notification
    const organization = await prisma.organization.findUnique({
      where: {
        id: invitation.organizationId,
      },
    })

    // Create notification for the inviter
    if (organization) {
      await createNotificationAction(
        `${session.user.name} has accepted your invitation to join ${organization.name}`,
        NotificationType.success,
        invitation.inviterId,
        'Invitation',
        invitation.id
      )
    }

    revalidatePath('/admin')
    return {
      status: 'success',
      message: 'Invitation accepted successfully',
      data: member,
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to accept invitation: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Reject invitation
export async function rejectInvitationAction(invitationId: string): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // Find the invitation
    const invitation = await prisma.invitation.findUnique({
      where: {
        id: invitationId,
      },
    })

    if (!invitation) {
      return { status: 'error', message: 'Invitation not found' }
    }

    if (invitation.email !== session.user.email) {
      return { status: 'error', message: 'This invitation is not for you' }
    }

    if (invitation.status !== 'pending') {
      return { status: 'error', message: 'This invitation is no longer valid' }
    }

    // Update invitation status
    await prisma.invitation.update({
      where: {
        id: invitationId,
      },
      data: {
        status: 'rejected',
      },
    })

    // Get organization name for notification
    const organization = await prisma.organization.findUnique({
      where: {
        id: invitation.organizationId,
      },
    })

    // Create notification for the inviter
    const inviter = await prisma.user.findUnique({
      where: {
        id: invitation.inviterId,
      },
    })

    if (inviter && organization) {
      await createNotificationAction(
        `${session.user.name} has rejected your invitation to join ${organization.name}`,
        NotificationType.information,
        invitation.inviterId,
        'Invitation',
        invitation.id
      )
    }

    revalidatePath('/admin')
    return { status: 'success', message: 'Invitation rejected successfully' }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to reject invitation: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Update member role
export async function updateMemberRoleAction(
  organizationId: string,
  values: UpdateMemberRoleSchemaType
): Promise<ApiResponseWithData<{ id: string; role: string }>> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = updateMemberRoleSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    // Check if user is a member of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return {
        status: 'error',
        message: 'You are not a member of this organization',
      }
    }

    // Check if user has permission to update roles (must be owner)
    if (member.role !== 'owner') {
      return {
        status: 'error',
        message: "You don't have permission to update member roles",
      }
    }

    // Check if we're trying to update owner's role (not allowed)
    const memberToUpdate = await prisma.member.findUnique({
      where: {
        id: validation.data.memberId,
      },
    })

    if (!memberToUpdate) {
      return { status: 'error', message: 'Member not found' }
    }

    if (memberToUpdate.role === 'owner') {
      return {
        status: 'error',
        message: 'Cannot change the role of the organization owner',
      }
    }

    // Update member role
    const updatedMember = await prisma.member.update({
      where: {
        id: validation.data.memberId,
      },
      data: {
        role: validation.data.role,
      },
    })

    // Get organization name for notification
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    })

    // Create notification for the updated member
    if (organization) {
      await createNotificationAction(
        `Your role in ${organization.name} has been updated to ${validation.data.role}`,
        NotificationType.information,
        memberToUpdate.userId,
        'Member',
        memberToUpdate.id
      )
    }

    revalidatePath('/admin')
    return {
      status: 'success',
      message: 'Member role updated successfully',
      data: updatedMember,
    }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to update member role: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Remove member from organization
export async function removeMemberAction(
  organizationId: string,
  values: RemoveMemberSchemaType
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = removeMemberSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    // Check if user is a member of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return {
        status: 'error',
        message: 'You are not a member of this organization',
      }
    }

    // Check if user has permission to remove members (must be owner or admin)
    if (member.role !== 'owner' && member.role !== 'admin') {
      return {
        status: 'error',
        message: "You don't have permission to remove members",
      }
    }

    // Check if we're trying to remove owner (not allowed)
    const memberToRemove = await prisma.member.findUnique({
      where: {
        id: validation.data.memberId,
      },
    })

    if (!memberToRemove) {
      return { status: 'error', message: 'Member not found' }
    }

    if (memberToRemove.role === 'owner') {
      return {
        status: 'error',
        message: 'Cannot remove the organization owner',
      }
    }

    // Check if we're trying to remove ourselves (only owners can remove themselves)
    if (memberToRemove.userId === session.user.id && member.role !== 'owner') {
      return {
        status: 'error',
        message: 'You cannot remove yourself unless you are the owner',
      }
    }

    // Remove member
    await prisma.member.delete({
      where: {
        id: validation.data.memberId,
      },
    })

    // Get organization name for notification
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
      },
    })

    // Create notification for the removed member
    if (organization) {
      await createNotificationAction(
        `You have been removed from ${organization.name}`,
        NotificationType.warning,
        memberToRemove.userId,
        'Member',
        memberToRemove.id
      )
    }

    revalidatePath('/admin')
    return { status: 'success', message: 'Member removed successfully' }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to remove member: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Switch active organization
export async function switchOrganizationAction(
  values: SwitchOrganizationSchemaType
): Promise<ApiResponse> {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const validation = switchOrganizationSchema.safeParse(values)
    if (!validation.success) {
      return { status: 'error', message: 'Invalid form data' }
    }

    // Check if user is a member of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: validation.data.organizationId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return {
        status: 'error',
        message: 'You are not a member of this organization',
      }
    }

    // Update session with new active organization
    await prisma.session.updateMany({
      where: {
        userId: session.user.id,
      },
      data: {
        activeOrganizationId: validation.data.organizationId,
      },
    })

    revalidatePath('/admin')
    return { status: 'success', message: 'Organization switched successfully' }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to switch organization: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Get user organizations
export async function getUserOrganizationsAction() {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    const organizations = await prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    })

    return { status: 'success', data: organizations }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to fetch organizations: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Get organization invitations
export async function getOrganizationInvitationsAction(organizationId: string) {
  // admin session check
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  try {
    // Check if user is a member of the organization
    const member = await prisma.member.findFirst({
      where: {
        organizationId: organizationId,
        userId: session.user.id,
      },
    })

    if (!member) {
      return {
        status: 'error',
        message: 'You are not a member of this organization',
      }
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId: organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return { status: 'success', data: invitations }
  } catch (error) {
    return {
      status: 'error',
      message: `Failed to fetch invitations: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}
