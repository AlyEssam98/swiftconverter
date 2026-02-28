'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link - no token provided');
                return;
            }

            try {
                const response = await api.get(`/api/v1/auth/verify-email?token=${token}`);
                
                if (response.status === 200) {
                    setStatus('success');
                    setMessage('✓ Email verified successfully! You now have 5 free credits.');
                    
                    // Redirect to login after 3 seconds
                    setTimeout(() => router.push('/auth/login'), 3000);
                } else {
                    setStatus('error');
                    setMessage('Verification failed. Please try signing up again.');
                }
            } catch (error: any) {
                console.error('Email verification error:', error);
                
                const errorMsg = error?.response?.data?.message || (
                    error?.message?.includes('404') 
                        ? 'Verification link expired or invalid'
                        : 'Failed to verify email. Please try again or sign up again.'
                );
                
                setStatus('error');
                setMessage(errorMsg);
            }
        };

        verifyEmail();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-6 text-center">
                {status === 'loading' && (
                    <>
                        <div className="flex justify-center">
                            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Verifying your email...</h1>
                        <p className="text-gray-500">Please wait while we confirm your email address.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Email verified!</h1>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-500">Redirecting to login in a few seconds...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Verification failed</h1>
                        <p className="text-gray-600">{message}</p>
                        
                        <div className="space-y-2 pt-4">
                            <Link 
                                href="/auth/login"
                                className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                            >
                                Go to Login
                            </Link>
                            <Link 
                                href="/auth/register"
                                className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-semibold transition"
                            >
                                Sign Up Again
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
