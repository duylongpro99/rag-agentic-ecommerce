import { caller } from '@/trpc/server';
import { ConversationView } from '../views/conversation.view';

export default async function Page() {
    void (await caller.auth.session());

    return (
        <main className="min-h-screen bg-background">
            <ConversationView />
        </main>
    );
}
