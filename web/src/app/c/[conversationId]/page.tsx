'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useRef } from 'react';
import { MessageInput } from '@/components/chat/message-input';
import { MessageBubble } from '@/components/chat/message-bubble';
import { trpc } from '@/trpc/client';

export default function ConversationPage() {
    const params = useParams();
    const conversationId = params.conversationId as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        data: conversation,
        refetch,
        isLoading,
    } = trpc.conversation.getById.useQuery({ id: conversationId }, { enabled: !!conversationId });

    const addMessage = trpc.conversation.addMessage.useMutation({
        onSuccess: () => refetch(),
    });

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation?.messages]);

    const handleSendMessage = async (content: string) => {
        if (!conversation) return;

        try {
            // Add user message
            await addMessage.mutateAsync({
                conversationId,
                content,
                role: 'user',
            });

            // Simulate assistant response
            setTimeout(async () => {
                try {
                    await addMessage.mutateAsync({
                        conversationId,
                        content: `I found some products matching "${content}". Would you like to see more details?`,
                        role: 'assistant',
                    });
                } catch (error) {
                    console.error('Error adding assistant message:', error);
                }
            }, 1000);
        } catch (error) {
            console.error('Error adding user message:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Loading conversation...</p>
            </div>
        );
    }

    if (!conversation) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>Conversation not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl p-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Product Search Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto p-2">
                        {conversation.messages.map((message) => (
                            <MessageBubble key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="mt-6">
                        <MessageInput onSend={handleSendMessage} />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
