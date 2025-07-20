import { Vortex } from '@/components/ui/vortex';
import { caller } from '@/trpc/server';
import { ConversationView } from '../views/conversation.view';

export default async function Page() {
    void (await caller.auth.session());

    return (
        <main className="min-h-screen bg-background">
            <Vortex backgroundColor="black" className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full">
                <ConversationView />
            </Vortex>
        </main>
    );
}
