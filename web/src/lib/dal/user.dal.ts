import { prisma } from '@/server/prisma/client';
import { v7 } from 'uuid';

export interface ClerkUser {
    id: string;
    fullName: string;
    email: string;
}

export interface UserCreateInput {
    id: string;
    name: string;
    email: string;
    orgId?: string;
}

export const userDal = {
    /**
     * Create a new user in the database
     */
    async create(input: UserCreateInput) {
        return prisma.user.upsert({
            where: {
                email: input.email,
                subId: input.id,
            },
            update: {
                name: input.name,
                orgId: input.orgId,
            },
            create: {
                id: v7(),
                orgId: input.orgId,
                email: input.email,
                name: input.name,
                subId: input.id,
            },
        });
    },

    /**
     * Find a user by their Clerk ID
     */
    async findBySubId(subId: string) {
        return prisma.user.findUnique({
            where: { subId },
        });
    },
};
