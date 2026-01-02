'use client';

import { useEffect } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  useEffect(() => {
    const handleCallback = async () => {
      if (!signIn || !signUp) return;
      
      try {
        // Clerk handles the callback automatically
        // Just redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        console.error('SSO callback error:', err);
        router.push('/signin');
      }
    };

    handleCallback();
  }, [signIn, signUp, router]);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400">Completing sign in...</p>
      </div>
    </div>
  );
}
