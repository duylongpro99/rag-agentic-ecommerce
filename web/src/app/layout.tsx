import { TRPCProvider } from '@/trpc/client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { UserInitializer } from '@/components/auth/user-initializer';
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export const metadata: Metadata = {
    title: 'AI Product Search Assistant',
    description: 'Conversational e-commerce product search powered by AI',
};

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
            <TRPCProvider>
                <html lang="en">
                    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
                </html>
            </TRPCProvider>
        </ClerkProvider>
    );
}
