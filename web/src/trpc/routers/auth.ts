import { ClerkUser, userDal } from '@/lib/dal/user.dal';
import { TRPCError } from '@trpc/server';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import jwt from 'jsonwebtoken';

export const authRouter = createTRPCRouter({
    session: protectedProcedure.query(async ({ ctx }) => {
        const subId = ctx.auth.userId;
        if (!subId) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Please login to continue',
            });
        }

        // Check if user already exists
        const existingUser = await userDal.findBySubId(subId);
        if (existingUser) {
            return;
        }

        const token = await ctx.auth.getToken({ template: process.env.CLERK_TOKEN_TEMPLATE! });
        const user = jwt.decode(token as string) as ClerkUser;

        // Create new user
        void (await userDal.create({
            id: subId,
            name: user.fullName ?? '',
            email: user.email ?? '',
            orgId: ctx.auth.orgId,
        }));

        return true;
    }),
    
    logout: baseProcedure.mutation(async () => {
        // The actual logout is handled by Clerk on the client side
        // This endpoint is just for TRPC routing purposes
        return { success: true };
    }),
});
