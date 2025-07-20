import { createTRPCRouter } from '../init';
import { authRouter } from './auth';
import { userRouter } from './user';
import { conversationRouter } from './conversation';

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
    conversation: conversationRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
