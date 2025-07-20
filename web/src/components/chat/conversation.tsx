'use client';

import { trpc } from '@/trpc/client';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

export const Conversation: React.FC = () => {
    const router = useRouter();
    const [inputValue, setInputValue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createConversation = trpc.conversation.create.useMutation();
    const { user } = useUser();

    const placeholders = [
        'Which shirts are available in red color?',
        "What brands offer men's polo shirts?",
        'Do you have dresses under $50?',
        'Are there any eco-friendly shoes available?',
        'Which backpacks are waterproof?',
        'Show me laptops with at least 16GB RAM.',
        'Which products are bestsellers in skincare?',
        'Do you have any cotton T-shirts for kids?',
        'What are the newest arrivals in the sneaker category?',
        'Are there any black dresses in size M?',
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!inputValue.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            // Create a new conversation with the user's message
            const conversation = await createConversation.mutateAsync({
                message: inputValue,
                subId: user?.id as string,
            });

            // Navigate to the conversation page
            router.push(`/c/${conversation.id}`);
        } catch (error) {
            console.error('Failed to create conversation:', error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-[40rem] flex flex-col justify-center items-center px-4">
            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">Ask to search products</h2>
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} disabled={isSubmitting} />
        </div>
    );
};
