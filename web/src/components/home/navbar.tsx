'use client';

import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from '@/components/ui/resizable-navbar';
import { trpc } from '@/trpc/client';
import { useClerk, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function HomeNavbar() {
    const navItems = [
        {
            name: 'Features',
            link: '#features',
        },
        {
            name: 'Pricing',
            link: '#pricing',
        },
        {
            name: 'Contact',
            link: '#contact',
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const logout = trpc.auth.logout.useMutation();

    const handleLogout = async () => {
        await logout.mutateAsync();
        await signOut();
        router.push('/');
    };

    return (
        <div className="relative w-full">
            <Navbar>
                {/* Desktop Navigation */}
                <NavBody>
                    <NavbarLogo />
                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        {isSignedIn ? (
                            <NavbarButton onClick={handleLogout} variant="primary">
                                Logout
                            </NavbarButton>
                        ) : (
                            <>
                                <NavbarButton href="/sign-in" variant="secondary">
                                    Login
                                </NavbarButton>
                                <NavbarButton href="/sign-up" variant="primary">
                                    Sign up
                                </NavbarButton>
                            </>
                        )}
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle isOpen={isMobileMenuOpen} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                    </MobileNavHeader>

                    <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4">
                            {isSignedIn ? (
                                <NavbarButton 
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }} 
                                    variant="primary" 
                                    className="w-full"
                                >
                                    Logout
                                </NavbarButton>
                            ) : (
                                <>
                                    <NavbarButton href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">
                                        Login
                                    </NavbarButton>
                                    <NavbarButton href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} variant="primary" className="w-full">
                                        Sign up
                                    </NavbarButton>
                                </>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
