'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const processedRef = useRef(false); // Prevent double execution

    useEffect(() => {
        // Skip if already processed
        if (processedRef.current) return;

        const token = searchParams.get('token');
        const errorParam = searchParams.get('error');

        if (errorParam) {
            processedRef.current = true;
            setError('OAuth2 authentication failed. Please try again or use email/password login.');
            setTimeout(() => router.push('/auth/login'), 3000);
            return;
        }

        if (token) {
            processedRef.current = true;
            try {
                login(token);
                // Redirect after a small delay to allow state to update
                setTimeout(() => router.push('/dashboard'), 100);
            } catch (err) {
                setError('Failed to process login. Please try again.');
                setTimeout(() => router.push('/auth/login'), 3000);
            }
        } else if (searchParams.toString()) {
            // Only set error if we have search params (meaning callback was attempted)
            processedRef.current = true;
            setError('No authentication token received. Please try again.');
            setTimeout(() => router.push('/auth/login'), 3000);
        }
    }, [searchParams, login, router]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-6 text-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Authentication Error</h1>
                        <p className="text-red-600 mt-4">{error}</p>
                        <p className="text-gray-500 text-sm mt-2">Redirecting to login page...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-6 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Processing Login</h1>
                    <div className="flex justify-center mt-6">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                    <p className="text-gray-500 mt-6">Completing your authentication...</p>
                </div>
            </div>
        </div>
    );
}
