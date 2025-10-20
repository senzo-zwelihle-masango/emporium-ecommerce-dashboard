import { createAuthClient } from 'better-auth/react'
import { adminClient } from 'better-auth/client/plugins'
import { organizationClient } from 'better-auth/client/plugins'
import { lastLoginMethodClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [adminClient(), organizationClient(), lastLoginMethodClient()],
})
