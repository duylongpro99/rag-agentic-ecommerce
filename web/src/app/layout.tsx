import { TRPCProvider } from '@/trpc/client';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

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
                <html lang="en" suppressHydrationWarning>
                    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange enableSystem>
                            {children}
                        </ThemeProvider>
                    </body>
                </html>
            </TRPCProvider>
        </ClerkProvider>
    );
}
