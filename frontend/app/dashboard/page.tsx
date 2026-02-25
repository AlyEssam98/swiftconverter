"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, CreditCard, FileText, CheckCircle, Zap, ArrowRight, FileCode2, ArrowRightLeft, Shield, Clock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import api from '@/lib/api';
import ConversionTool from '@/components/conversion/ConversionTool';
import { useAuth } from '@/context/AuthContext';

interface DashboardStats {
    availableCredits: number;
    conversionsToday: number;
    successRate: string;
    totalConversions: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null as DashboardStats | null);
    const [loading, setLoading] = useState(true);
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    // Listen for visibility change and page show to refresh stats when returning to page
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchStats();
                refreshUser();
            }
        };

        const handlePageShow = (event: any) => {
            if (event.persisted) {
                // Page was restored from bfcache, refresh data
                setTimeout(() => {
                    fetchStats();
                    refreshUser();
                }, 500);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, [refreshUser]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/api/v1/dashboard/stats');
            setStats(res.data as DashboardStats);
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setLoading(false);
        }
    };

    // Callback when conversion completes to refresh credits
    const handleConversionComplete = () => {
        fetchStats();
        refreshUser();
    };

    return (
        <div className="space-y-8">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Credits</span>
                        <CreditCard className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.availableCredits ?? 0}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Today</span>
                        <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.conversionsToday ?? 0}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Success</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.successRate ?? '100%'}</p>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Total</span>
                        <TrendingUp className="w-4 h-4 text-orange-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalConversions ?? 0}</p>
                </div>
            </div>

            {/* Hero Section */}
            <section className="text-center py-8">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-4">
                    <Zap className="w-4 h-4 mr-1" />
                    Instant MT to MX Conversion
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    SWIFT MT to MX Converter
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Convert SWIFT MT messages to ISO 20022 MX format instantly.
                    Professional pacs.008 generator with bank-grade validation.
                </p>
            </section>

            {/* Converter Tool */}
            <section>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <FileCode2 className="w-5 h-5 text-blue-600" />
                                <span className="font-medium text-gray-900">MT to MX Converter</span>
                            </div>
                            <span className="text-sm text-gray-500">1 credit = 1 conversion</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <ConversionTool isDashboard={true} onConversionComplete={handleConversionComplete} />
                    </div>
                </div>
            </section>

            {/* Supported Formats */}
            <section className="py-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Supported Message Types</h2>
                    <p className="text-gray-600">Convert between legacy MT formats and modern ISO 20022 MX standards</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <FormatCard mt="MT103" mx="pacs.008" title="Customer Credit Transfer" description="Single customer-to-customer payment" />
                    <FormatCard mt="MT202" mx="pacs.009" title="Financial Institution Transfer" description="Bank-to-bank payment instruction" />
                    <FormatCard mt="MT940" mx="camt.053" title="Account Statement" description="Bank account statement report" />
                </div>
            </section>

            {/* Features */}
            <section className="py-8 border-t border-gray-200">
                <div className="grid md:grid-cols-4 gap-6 text-center">
                    <FeatureItem icon={<Shield className="w-6 h-6 text-blue-600" />} title="Bank-Grade Security" description="AES-256 encryption, TLS 1.3" />
                    <FeatureItem icon={<Clock className="w-6 h-6 text-green-600" />} title="Instant Results" description="Sub-second conversion time" />
                    <FeatureItem icon={<CheckCircle className="w-6 h-6 text-purple-600" />} title="Validated Output" description="ISO 20022 compliant" />
                    <FeatureItem icon={<Globe className="w-6 h-6 text-orange-600" />} title="Global Standards" description="Full ISO 20022 support" />
                </div>
            </section>

            {/* Quick Actions */}
            <section className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard/credits" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-3 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Buy Credits</h3>
                    </div>
                    <p className="text-sm text-gray-500">Purchase more conversion credits</p>
                </Link>
                <Link href="/dashboard/history" className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">View History</h3>
                    </div>
                    <p className="text-sm text-gray-500">See your past conversions</p>
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 rounded-xl p-8 mt-12">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <ArrowRightLeft className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-white">SWIFT Converter</span>
                        </div>
                        <p className="text-sm">Professional MT to MX conversion tool for financial institutions.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard" className="hover:text-white">MT to MX Converter</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white">ISO 20022 Validator</Link></li>
                            <li><Link href="/dashboard/credits" className="hover:text-white">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Message Types</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/dashboard" className="hover:text-white">MT103 to pacs.008</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white">MT202 to pacs.009</Link></li>
                            <li><Link href="/dashboard" className="hover:text-white">MT940 to camt.053</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Feedback</h4>
                        <p className="text-sm mb-3">Have suggestions? We&apos;d love to hear from you.</p>
                        <FeedbackForm />
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-6 mt-6 text-center text-sm">
                    <p>© 2026 SWIFT Converter. Professional MT to MX online conversion, MT103 to MX, swift converter online for financial messaging. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeedbackForm() {
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || message.length < 10) return;
        
        setSubmitting(true);
        try {
            await api.post('/api/v1/feedback', { message: message.trim() });
            setSubmitted(true);
            setMessage('');
            toast.success('Thank you! Your feedback has been sent to our support team.');
        } catch (err) {
            toast.error('Failed to send feedback. Please try again later.');
            console.error('Feedback submission error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-sm text-green-400">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Thank you for your feedback!
            </div>
        );
    }

    return (
        <form className="space-y-3" onSubmit={handleSubmit}>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
                minLength={10}
                maxLength={5000}
                required
            />
            <button
                type="submit"
                disabled={submitting || message.length < 10}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
            >
                {submitting ? 'Sending...' : 'Send Feedback'}
            </button>
        </form>
    );
}

function FormatCard({ mt, mx, title, description }: { mt: string; mx: string; title: string; description: string }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">{mt}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">{mx}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                {icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}
