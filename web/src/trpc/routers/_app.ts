import { createTRPCRouter } from '../init';
import { authRouter } from './auth';
import { userRouter } from './user';

export const appRouter = createTRPCRouter({
    user: userRouter,
    auth: authRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
