'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import CallbackContent from './callback-content';

export default function CallbackPage() {
    return (
        <Suspense
            fallback={
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
            }
        >
            <CallbackContent />
        </Suspense>
    );
}
