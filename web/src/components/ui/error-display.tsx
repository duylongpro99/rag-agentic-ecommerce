'use client';

import { Button } from '@/components/ui/button';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';

interface ErrorDisplayProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorDisplay({ error, reset }: ErrorDisplayProps) {
  const router = useRouter();
  const isUnauthorized = error instanceof TRPCClientError && 
    'data' in error && 
    error.data?.code === 'UNAUTHORIZED';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {isUnauthorized ? 'Authentication Required' : 'Something went wrong!'}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {isUnauthorized 
            ? 'You need to be signed in to access this page.' 
            : error.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isUnauthorized ? (
            <Button 
              onClick={() => router.push('/sign-in')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          ) : (
            <Button 
              onClick={() => reset()}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
          )}
          
          <Button 
            onClick={() => router.push('/')}
            variant="outline"
            className="border-gray-300"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}