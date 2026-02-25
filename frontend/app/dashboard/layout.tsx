"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, RefreshCw, Settings, LogOut, Menu, X, ArrowRightLeft, CreditCard, BarChart3, FileText, MessageSquare } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, router, isLoading, isClient]);

    if (isLoading || !isClient) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const navItems = [
        { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/convert', label: 'Convert', icon: RefreshCw },
        { href: '/dashboard/history', label: 'History', icon: FileText },
        { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/dashboard/credits', label: 'Credits', icon: CreditCard },
        { href: '/dashboard/contact', label: 'Contact Us', icon: MessageSquare },
        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform lg:translate-x-0 ${
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="h-full flex flex-col p-4">
                    {/* Logo */}
                    <div className="flex items-center justify-between mb-6 px-2">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <ArrowRightLeft className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">SWIFT Converter</span>
                        </Link>
                        <button
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors text-sm font-medium"
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User & Logout */}
                    <div className="border-t border-gray-200 pt-4 space-y-1">
                        <div className="px-3 py-2 text-xs text-gray-500 truncate">
                            {user?.email || 'Loading...'}
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full text-sm font-medium"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-64">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="lg:hidden text-gray-600 hover:text-gray-900 p-1"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>SWIFT MT to MX Converter</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 md:p-6">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-30 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}
        </div>
    );
}
