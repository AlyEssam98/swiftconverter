"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreditCancelPage() {
    return (
        <div className="flex items-center justify-center min-h-[400px] animate-fade-in">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-red-100 rounded-full">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-gray-600">
                        The payment process was cancelled. No credits have been added to your account.
                    </p>
                    <div className="flex flex-col space-y-2">
                        <Link href="/dashboard/credits">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Credits
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
