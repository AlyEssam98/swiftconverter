"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Shield, Clock, FileCode2, ArrowRightLeft, Globe } from 'lucide-react';
import { toast } from 'sonner';
import ConversionTool from '@/components/conversion/ConversionTool';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <ArrowRightLeft className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900">SWIFT Converter</span>
                            <span className="text-xs text-gray-500">MT to MX Translation</span>
                        </div>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/auth/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                            Sign in
                        </Link>
                        <Link href="/auth/register">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                Get Started Free
                            </Button>
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 pt-20 pb-16">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                                <Zap className="w-4 h-4 mr-1" />
                                MT to MX Online Conversion
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                Free MT to MX Converter &
                                <span className="text-blue-600"> Online SWIFT Tool</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8">
                                Convert SWIFT MT messages to ISO 20022 MX format online instantly. 
                                Professional swift mt to mx converter with free MT103 to MX conversion. 
                                No signup required for instant results.
                            </p>
                            <div className="flex flex-wrap gap-4 mb-8">
                                <Link href="/auth/register">
                                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                        Start Converting Free
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <Link href="#try-it">
                                    <Button variant="outline" size="lg">
                                        Try Online Now
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Free MT103 to MX conversion</span>
                                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> 5 free credits</span>
                                <span className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Instant online converter</span>
                            </div>
                        </div>
                        
                        {/* Hero Visual */}
                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl blur-3xl opacity-20"></div>
                                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-hidden">
                                        <div className="text-blue-400 mb-2">{`{1:F01BANKBEBBAXXX0000000000}`}</div>
                                        <div className="text-green-400 mb-2">{`{2:I103BANKBEBBXXXXN}`}</div>
                                        <div className="text-gray-400 mb-4">{`{4:`}</div>
                                        <div className="pl-4 space-y-1">
                                            <div>:20:REF123456789</div>
                                            <div>:23B:CRED</div>
                                            <div>:32A:240115USD1000,00</div>
                                            <div>:50K:/123456789</div>
                                            <div className="text-gray-500">...</div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center my-4">
                                        <div className="flex items-center space-x-2 text-blue-600">
                                            <ArrowRightLeft className="w-5 h-5" />
                                            <span className="text-sm font-medium">Converting...</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-600">
                                        <div className="text-purple-600 mb-2">{`<Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.02">`}</div>
                                        <div className="pl-4 space-y-1">
                                            <div>{`<CdtTrfTxInf>`}</div>
                                            <div className="pl-4">{`<PmtId>`}</div>
                                            <div className="pl-8 text-blue-600">{`<EndToEndId>REF123456789</EndToEndId>`}</div>
                                            <div className="pl-4">{`</PmtId>`}</div>
                                            <div className="text-gray-400">...</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Converter Tool */}
            <section id="try-it" className="container mx-auto px-4 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Try MT to MX Converter Online — Free</h2>
                        <p className="text-gray-500">No signup required. Experience the best swift mt to mx converter online with instant results.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <FileCode2 className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">MT to MX Online Converter</span>
                                </div>
                                <span className="text-sm text-gray-500">Free swift mt to mx conversion</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <ConversionTool />
                        </div>
                    </div>
                </div>
            </section>

            {/* Supported Formats */}
            <section className="bg-gray-50 py-20 border-y border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            MT to MX Online Conversion - All Formats
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Professional swift mt to mx converter online supporting all major SWIFT message types to ISO 20022 standards</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <FormatCard
                            mt="MT103"
                            mx="pacs.008"
                            title="Customer Credit Transfer"
                            description="Single customer-to-customer payment instruction"
                        />
                        <FormatCard
                            mt="MT202"
                            mx="pacs.009"
                            title="Financial Institution Transfer"
                            description="Bank-to-bank payment instruction"
                        />
                        <FormatCard
                            mt="MT940"
                            mx="camt.053"
                            title="Account Statement"
                            description="Bank account statement and balance report"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <FeatureItem
                            icon={<Clock className="w-5 h-5 text-blue-600" />}
                            title="Instant Conversion"
                            description="Convert messages in milliseconds with our optimized engine"
                        />
                        <FeatureItem
                            icon={<Shield className="w-5 h-5 text-blue-600" />}
                            title="Secure & Private"
                            description="AES-256 encryption, TLS 1.3, no data retention"
                        />
                        <FeatureItem
                            icon={<FileCode2 className="w-5 h-5 text-blue-600" />}
                            title="ISO 20022 Compliant"
                            description="Full validation against official XSD schemas"
                        />
                        <FeatureItem
                            icon={<Globe className="w-5 h-5 text-blue-600" />}
                            title="SWIFT Ready"
                            description="Compatible with SWIFT network and gpi tracking"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-gray-50 py-16 border-y border-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <Step number="1" title="Paste Your Message" description="Upload or paste your SWIFT MT or ISO 20022 MX message" />
                        <Step number="2" title="Select Type" description="Choose the message type (MT103, MT202, MT940, etc.)" />
                        <Step number="3" title="Get Result" description="Instantly receive your converted, validated message" />
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                            Simple, Credit-Based Pricing
                        </h2>
                        <p className="text-gray-600 mb-8">Pay only for what you use. No subscriptions, no hidden fees.</p>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <div className="flex justify-center items-baseline space-x-2 mb-6">
                                <span className="text-4xl font-bold text-gray-900">$0.10</span>
                                <span className="text-gray-500">per conversion</span>
                            </div>
                            <ul className="text-left max-w-xs mx-auto space-y-3 mb-8">
                                <li className="flex items-center text-gray-600">
                                    <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                                    5 free credits on signup
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                                    No expiration on credits
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                                    Volume discounts available
                                </li>
                            </ul>
                            <Link href="/auth/register">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                    Start Free <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section for SEO */}
            <section className="bg-gray-50 py-16 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        <FAQItem
                            question="What is the best MT to MX online converter?"
                            answer="The best MT to MX online converter offers instant conversion, supports multiple message types (MT103, MT202, MT940), provides bank-grade validation, and requires no signup. Our swift mt to mx converter online delivers professional results with ISO 20022 compliance."
                        />
                        <FAQItem
                            question="How does MT to MX online conversion work?"
                            answer="MT to MX online conversion transforms SWIFT FIN messages into ISO 20022 XML format. Our swift converter online parses the MT message structure, validates it against SWIFT standards, and generates the corresponding MX message with proper schema validation."
                        />
                        <FAQItem
                            question="Is there a free MT103 to MX converter online?"
                            answer="Yes! Our MT103 to MX converter online offers 5 free credits for new users. Convert SWIFT MT103 messages to pacs.008 format instantly without signup. Experience professional swift mt to mx conversion at no cost."
                        />
                        <FAQItem
                            question="What message types does the swift mt to mx converter support?"
                            answer="Our swift mt to mx converter online supports MT103 to pacs.008, MT202 to pacs.009, MT940 to camt.053, and other major SWIFT message types. All conversions include ISO 20022 validation and instant results."
                        />
                        <FAQItem
                            question="Why choose our MT to MX converter online?"
                            answer="Our MT to MX converter online provides instant results, bank-grade security, ISO 20022 compliance, and supports all major message types. No signup required for trial conversions. Professional swift converter for financial institutions."
                        />
                        <FAQItem
                            question="Is the swift mt to mx converter secure?"
                            answer="Yes. Our swift mt to mx converter online uses AES-256 encryption, TLS 1.3 protocols, and doesn't store your messages. All conversions happen in secure, isolated environments with enterprise-grade security measures."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <ArrowRightLeft className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-semibold text-white">MT to MX Online</span>
                            </div>
                            <p className="text-sm">Professional MT to MX online converter. Free swift mt to mx conversion tool for financial institutions.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Online Tools</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-white">MT to MX Converter Online</Link></li>
                                <li><Link href="/" className="hover:text-white">Swift MT to MX Converter</Link></li>
                                <li><Link href="/" className="hover:text-white">Free MT103 to MX</Link></li>
                                <li><Link href="/auth/register" className="hover:text-white">Online Converter</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Message Types</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/" className="hover:text-white">MT103 to pacs.008 Online</Link></li>
                                <li><Link href="/" className="hover:text-white">MT202 to pacs.009 Converter</Link></li>
                                <li><Link href="/" className="hover:text-white">MT940 to camt.053 Online</Link></li>
                                <li><Link href="/" className="hover:text-white">Swift Converter Online</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-4">Support</h4>
                            <p className="text-sm mb-3">Need help with MT to MX online conversion? Contact our support team.</p>
                            <FeedbackForm />
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm">
                        <p>© 2026 MT to MX Online Converter. Professional swift mt to mx converter, free MT103 to MX conversion online, SWIFT converter tool for financial messaging. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
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
        <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">
                {number}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">{question}</h3>
            <p className="text-gray-600 text-sm">{answer}</p>
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
            const api = (await import('@/lib/api')).default;
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
