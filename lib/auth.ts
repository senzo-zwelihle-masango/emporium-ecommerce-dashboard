import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { organization } from 'better-auth/plugins'
import { lastLoginMethod } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'

import { prisma } from '@/lib/prisma/client'
import { env } from '@/env/server'

export const auth = betterAuth({
  // database configuration and other options go here
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  //   social logins
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },

  // basic auth
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  // plugins
  plugins: [admin(), organization(), lastLoginMethod(), nextCookies()],
})
