"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Loader2, CheckCircle, XCircle } from 'lucide-react';
import api from '@/lib/api';

interface AnalyticsData {
    dailyCounts: Array<{ date: string; count: number }>;
    summary: {
        total: number;
        successful: number;
        failed: number;
        successRate: string;
    };
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState(null as AnalyticsData | null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/api/v1/analytics/stats');
                setStats(res.data as AnalyticsData);
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const counts = stats?.dailyCounts.map((d: any) => d.count) || [0];
    const maxCount = Math.max(...counts, 1);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
                <p className="text-gray-600">Track your usage and performance metrics</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="w-5 h-5 text-purple-600" />
                            <span>Usage Statistics</span>
                        </CardTitle>
                        <CardDescription>Conversions in the last 7 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-48 pt-6">
                            {stats?.dailyCounts.map((d: any, i: number) => (
                                <div key={i} className="flex flex-col items-center flex-1 space-y-2 group">
                                    <div className="relative w-full flex justify-center items-end h-full px-1">
                                        <div
                                            className="w-full max-w-[24px] bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-sm transition-all duration-500 ease-out group-hover:from-purple-600 group-hover:to-pink-600"
                                            style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                                        >
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {d.count} conv
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 rotate-45 sm:rotate-0 mt-2">
                                        {new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <span>Performance Metrics</span>
                        </CardTitle>
                        <CardDescription>Conversion accuracy summary</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center space-x-2 text-green-700 mb-1">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Successful</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900">{stats?.summary.successful}</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                <div className="flex items-center space-x-2 text-red-700 mb-1">
                                    <XCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Failed</span>
                                </div>
                                <p className="text-2xl font-bold text-red-900">{stats?.summary.failed}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600">Overall Success Rate</span>
                                <span className="text-sm font-bold text-purple-600">{stats?.summary.successRate}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                                    style={{ width: stats?.summary.successRate }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
