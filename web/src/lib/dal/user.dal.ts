import { prisma } from '@/server/prisma/client';
import { v7 } from 'uuid';

export interface ClerkUser {
    id: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    emailAddresses: { emailAddress: string }[];
}

export interface UserCreateInput {
    id: string;
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    email: string;
}

export const userDal = {
    /**
     * Create a new user in the database
     */
    async createUser(input: UserCreateInput) {
        const name = [input.firstName, input.lastName].filter(Boolean).join(' ') || 'Anonymous User';

        return prisma.user.create({
            data: {
                id: v7(),
                name,
                subId: input.id,
                email: input.email,
            },
        });
    },

    /**
     * Find a user by their Clerk ID
     */
    async findUserBySubId(subId: string) {
        return prisma.user.findUnique({
            where: { subId },
        });
    },
};
