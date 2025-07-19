import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(['development', 'test', 'production']),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    throw new Error('❌ Invalid environment variables: ' + JSON.stringify(z.treeifyError(_env.error), null, 4));
}
export const env = _env.data;
