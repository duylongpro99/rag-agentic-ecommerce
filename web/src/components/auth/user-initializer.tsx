'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { trpc } from '@/trpc/client';

export const UserInitializer = () => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  
  const { mutate: createUser } = trpc.user.create.useMutation({
    onSuccess: () => {
      setIsInitializing(false);
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      setIsInitializing(false);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      setIsInitializing(true);
      
      // Get user data from Clerk
      fetch('/api/auth/user')
        .then(res => res.json())
        .then(userData => {
          createUser({
            id: userId,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.emailAddresses[0]?.emailAddress || '',
          });
        })
        .catch(err => {
          console.error('Error fetching user data:', err);
          setIsInitializing(false);
        });
    }
  }, [isLoaded, isSignedIn, userId, createUser]);

  if (isInitializing) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-center font-medium">Setting up your account...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};