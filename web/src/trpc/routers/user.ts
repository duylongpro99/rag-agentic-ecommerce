import { userDal } from '@/lib/dal/user.dal';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';

export const userRouter = createTRPCRouter({
    create: baseProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            // Check if user already exists
            const existingUser = await userDal.findUserBySubId(input.id);
            if (existingUser) {
                return existingUser;
            }

            // Create new user
            const user = await userDal.createUser({
                id: input.id,
                name: input.name,
                email: input.email,
            });

            return user;
        }),
});
