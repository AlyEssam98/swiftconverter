"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { Eye, EyeOff, Loader2, ArrowRightLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const [error, setError] = useState('');
    const router = useRouter();

    const getTokenFromResponse = (data: unknown): string | null => {
        if (typeof data === 'string' && data.trim()) return data.trim();
        if (!data || typeof data !== 'object') return null;
        const obj = data as Record<string, unknown>;
        const token = (obj.token ?? obj.accessToken ?? obj.access_token) as string | undefined;
        return typeof token === 'string' && token.trim() ? token.trim() : null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            if (!email || !password) {
                setError('Please enter both email and password');
                setIsLoading(false);
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters');
                setIsLoading(false);
                return;
            }
            const res = await api.post('/api/v1/auth/register', { email, password });
            const data = res?.data;
            const token = getTokenFromResponse(data);
            if (!token) {
                const msg = (data as { message?: string })?.message;
                setError(msg || 'Registration succeeded but no session token was returned. Please sign in.');
                return;
            }
            login(token);
            // Redirect after a small delay to allow state to update
            setTimeout(() => router.push('/dashboard'), 100);
        } catch (err: unknown) {
            const axiosError = err as any;
            if (axiosError?.response?.status === 400) {
                setError('Email already in use. Please use a different email or sign in.');
            } else if (axiosError?.response?.data?.message) {
                setError(axiosError.response.data.message);
            } else if (axiosError?.message === 'Network Error' || axiosError?.code === 'ECONNREFUSED') {
                setError('Unable to connect to server. Please check if the backend is running.');
            } else {
                setError('Registration failed. Email may already be in use.');
            }
            console.error('Registration error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left side - Info */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
                <div className="max-w-md text-white">
                    <h2 className="text-3xl font-bold mb-4">Start Converting for Free</h2>
                    <p className="text-blue-100 mb-8">
                        Get instant access to MT to MX conversion tools. 
                        No credit card required.
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span>5 free credits on signup</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span>MT103, MT202, MT940 support</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span>ISO 20022 compliant output</span>
                        </li>
                        <li className="flex items-center space-x-3">
                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                            <span>Bank-grade security</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-sm space-y-6">
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center space-x-2 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <ArrowRightLeft className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-gray-900">SWIFT Converter</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                        <p className="text-gray-500 mt-1">Get started with 5 free credits</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="bg-white border-gray-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    className="bg-white border-gray-200 pr-10"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">Minimum 6 characters</p>
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                {error}
                            </div>
                        )}
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
