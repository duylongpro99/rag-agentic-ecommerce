import { prisma } from '@/server/prisma/client';

export interface Message {
    id: string;
    content: string;
    role: string; // 'user' | 'assistant'
    createdAt: string;
}

export interface Conversation {
    id: string;
    messages: Message[];
    createdAt: Date;
}

export const conversationDal = {
    async create(initialMessage: string, userId: string = '00000000-0000-0000-0000-000000000000') {
        // Create a conversation with an initial message
        const conversation = await prisma.conversation.create({
            data: {
                title: initialMessage.slice(0, 50) + (initialMessage.length > 50 ? '...' : ''),
                userId,
                messages: {
                    create: [
                        {
                            content: initialMessage,
                            role: 'user',
                        },
                    ],
                },
            },
            include: {
                messages: true,
            },
        });

        return {
            id: conversation.id,
            messages: conversation.messages.map((msg) => ({
                id: msg.id,
                content: msg.content,
                role: msg.role,
                createdAt: msg.createdAt,
            })),
            createdAt: conversation.createdAt,
        };
    },

    async getById(id: string) {
        if (!id) return null;

        try {
            const conversation = await prisma.conversation.findUnique({
                where: { id },
                include: { messages: true },
            });

            if (!conversation) return null;

            return {
                id: conversation.id,
                messages: conversation.messages.map((msg) => ({
                    id: msg.id,
                    content: msg.content,
                    role: msg.role,
                    createdAt: msg.createdAt,
                })),
                createdAt: conversation.createdAt,
            };
        } catch (error) {
            console.error('Error fetching conversation:', error);
            return null;
        }
    },

    async addMessage(conversationId: string, content: string, role: 'user' | 'assistant') {
        if (!conversationId) throw new Error('Invalid conversation ID');

        const message = await prisma.message.create({
            data: {
                conversationId,
                content,
                role,
            },
        });

        return {
            id: message.id,
            content: message.content,
            role: message.role,
            createdAt: message.createdAt,
        };
    },
};
