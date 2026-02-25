"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import api from '@/lib/api';
import { Loader2, ArrowRightLeft, CheckCircle, Copy, Download, Upload, Trash2, X, AlertCircle, CreditCard, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface ConversionToolProps {
    isDashboard?: boolean;
    onConversionComplete?: () => void;
}

interface ConversionError {
    message: string;
    code?: string;
}

export default function ConversionTool({ isDashboard = false, onConversionComplete }: ConversionToolProps) {
    const [conversionType, setConversionType] = useState('MT103');
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null as ConversionError | null);
    const [showOutputModal, setShowOutputModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null as HTMLInputElement | null);

    const mtTypes = ['MT103', 'MT202', 'MT202COV', 'MT940', 'MT102'];

    const handleFile = (file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            setInput(content);
            setError(null);
        };
        reader.readAsText(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    };

    const handleConvert = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const res = await api.post('/api/v1/conversion/mt-to-mx', {
                mtMessage: input,
                messageType: conversionType
            });
            setOutput(res.data.xml);
            setShowOutputModal(true);
            // Notify parent to refresh credits
            if (onConversionComplete) {
                onConversionComplete();
            }
        } catch (err: unknown) {
            const errorData = (err as { response?: { data?: { code?: string; message?: string; error?: string } } }).response?.data;
            const errorCode = errorData?.code;
            
            let errorMessage = errorData?.message || errorData?.error;
            if (!errorMessage) {
                if (errorCode === 'INSUFFICIENT_CREDITS') {
                    errorMessage = 'You have run out of credits. Please purchase more to continue converting.';
                } else if (errorCode === 'ANONYMOUS_LIMIT_REACHED') {
                    errorMessage = 'You have reached the free conversion limit. Sign up to get 5 free credits.';
                } else {
                    errorMessage = 'Unable to process your SWIFT message. Please verify the message format and try again.';
                }
            }
            
            setError({ message: errorMessage, code: errorCode });
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
    };

    const clearInput = () => {
        setInput('');
        setOutput('');
        setError(null);
    };

    const downloadResult = () => {
        const blob = new Blob([output], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-${conversionType.toLowerCase()}.xml`;
        a.click();
    };

    return (
        <>
            <div className="space-y-4">
                {/* Message Type Selection */}
                <div className="flex flex-wrap gap-2">
                    {mtTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setConversionType(type)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                conversionType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">
                            MT Input
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                                className="hidden"
                                accept=".txt,.swift,.mt,.msg,.out,.xml,text/*"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-8 text-gray-600"
                            >
                                <Upload className="w-3.5 h-3.5 mr-1" />
                                Upload
                            </Button>
                            {input && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearInput}
                                    className="h-8 text-gray-500 hover:text-red-600"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                    <div
                        className={`relative rounded-lg border-2 border-dashed transition-colors ${
                            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <Textarea
                            placeholder="Paste your SWIFT MT message here..."
                            value={input}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
                            className={`min-h-[300px] font-mono text-sm border-0 focus-visible:ring-0 ${
                                isDragging ? 'opacity-50' : ''
                            }`}
                        />
                        {isDragging && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 rounded-lg">
                                <p className="text-blue-600 font-medium">Drop file here</p>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                        {input.length} characters
                    </div>
                </div>

                {/* Convert Button */}
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={handleConvert}
                        disabled={!input || loading}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Converting...
                            </>
                        ) : (
                            <>
                                <ArrowRightLeft className="w-4 h-4 mr-2" />
                                Convert to MX
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Output Modal */}
            {showOutputModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Conversion Successful</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="w-4 h-4 mr-1" />
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={downloadResult}
                                >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowOutputModal(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 overflow-auto flex-1">
                            <Textarea
                                value={output}
                                readOnly
                                className="min-h-[400px] font-mono text-sm bg-gray-50 border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && error && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className={`w-5 h-5 ${
                                    error.code === 'ANONYMOUS_LIMIT_REACHED' ? 'text-blue-600' :
                                    error.code === 'INSUFFICIENT_CREDITS' ? 'text-amber-600' : 'text-red-600'
                                }`} />
                                <h3 className="text-lg font-semibold text-gray-900">Conversion Failed</h3>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowErrorModal(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-600 mb-6">{error.message}</p>
                            
                            {error.code === 'ANONYMOUS_LIMIT_REACHED' && (
                                <Link href="/auth/register">
                                    <Button className="bg-blue-600 hover:bg-blue-700">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Sign Up & Get 5 Free Credits
                                    </Button>
                                </Link>
                            )}
                            
                            {error.code === 'INSUFFICIENT_CREDITS' && (
                                <Link href="/dashboard/credits">
                                    <Button className="bg-amber-600 hover:bg-amber-700">
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Buy Credits
                                    </Button>
                                </Link>
                            )}
                            
                            {!error.code && (
                                <Button variant="outline" onClick={() => setShowErrorModal(false)}>
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
