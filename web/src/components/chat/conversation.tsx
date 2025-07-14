'use client';

import React from 'react';
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input';

export const Conversation: React.FC = () => {
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
        console.log(e.target.value);
    };
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('submitted');
    };
    return (
        <div className="h-[40rem] flex flex-col justify-center  items-center px-4">
            <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">Ask to search products</h2>
            <PlaceholdersAndVanishInput placeholders={placeholders} onChange={handleChange} onSubmit={onSubmit} />
        </div>
    );
};
