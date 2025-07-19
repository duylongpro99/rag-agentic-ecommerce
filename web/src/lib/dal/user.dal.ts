import { prisma } from '@/server/prisma/client';
import { v7 } from 'uuid';

export interface ClerkUser {
    id: string;
    name: string | null | undefined;
    emailAddresses: { emailAddress: string }[];
}

export interface UserCreateInput {
    id: string;
    name: string;
    email: string;
}

export const userDal = {
    /**
     * Create a new user in the database
     */
    async createUser(input: UserCreateInput) {
        return prisma.user.create({
            data: {
                id: v7(),
                name: input.name,
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
