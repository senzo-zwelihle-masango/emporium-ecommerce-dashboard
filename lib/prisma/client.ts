import { PrismaClient } from '@/lib/generated/prisma'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create a regular Prisma Client instance
export const prisma = globalForPrisma.prisma || new PrismaClient()

// In development, reuse the Prisma Client across module reloads
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
