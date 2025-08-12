import { PrismaClient } from '@/generated/prisma'

// eslint-disable-next-line no-restricted-globals
const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['error', 'warn'],
})

// eslint-disable-next-line node/prefer-global/process
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma
