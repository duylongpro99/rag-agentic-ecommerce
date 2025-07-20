import { conversationDal } from '@/lib/dal/conversation.dal';
import { z } from 'zod';
import { baseProcedure, createTRPCRouter } from '../init';
import { userDal } from '@/lib/dal/user.dal';
import { TRPCError } from '@trpc/server';

export const conversationRouter = createTRPCRouter({
    create: baseProcedure
        .input(
            z.object({
                message: z.string(),
                subId: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const user = await userDal.findBySubId(input.subId);

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User is not existed ',
                });
            }

            return conversationDal.create(input.message, user.id);
        }),

    getById: baseProcedure.input(z.object({ id: z.uuid() })).query(async ({ input }) => {
        const conv = await conversationDal.getById(input.id);

        if (!conv) return null;

        return conv;
    }),

    addMessage: baseProcedure
        .input(
            z.object({
                conversationId: z.uuid(),
                content: z.string(),
                role: z.enum(['user', 'assistant']),
            }),
        )
        .mutation(async ({ input }) => {
            return conversationDal.addMessage(input.conversationId, input.content, input.role);
        }),
});
