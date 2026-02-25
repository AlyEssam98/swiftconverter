"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Loader2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function CreditSuccessPage() {
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(null as number | null);
    const { refreshUser } = useAuth();

    useEffect(() => {
        const refreshCredits = async () => {
            try {
                // Poll with small delays to wait for webhook processing
                let attempts = 0;
                let currentCredits = 0;
                
                while (attempts < 10) {
                    await refreshUser();
                    const response = await api.get('/api/v1/credits/balance');
                    currentCredits = response.data.availableCredits;
                    
                    // If we got credits above zero, we're done
                    if (currentCredits > 0) {
                        setCredits(currentCredits);
                        break;
                    }
                    
                    attempts++;
                    // Wait before retrying (exponential backoff)
                    if (attempts < 10) {
                        await new Promise((resolve: any) => setTimeout(resolve, 300 + attempts * 100));
                    }
                }
                
                if (currentCredits === 0) {
                    // Final attempt
                    setCredits(currentCredits);
                }
            } catch (error) {
                console.error('Failed to refresh credits:', error);
            } finally {
                setLoading(false);
            }
        };
        refreshCredits();
    }, [refreshUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Processing your payment...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500 mb-6">Your credits have been added to your account.</p>
                    
                    {credits !== null && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center space-x-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <span className="text-lg font-semibold text-gray-900">
                                    {credits} Credits Available
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/dashboard" className="flex-1">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Start Converting
                            </Button>
                        </Link>
                        <Link href="/dashboard/credits" className="flex-1">
                            <Button variant="outline" className="w-full">
                                View Credits <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
