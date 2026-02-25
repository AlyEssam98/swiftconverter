"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Trash, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';

type Conversion = {
    id: string;
    conversionType: string;
    status: 'SUCCESS' | 'FAILED' | 'PARTIAL_SUCCESS';
    inputContent?: string | null;
    outputContent?: string | null;
    sourceFormat?: string | null;
    targetFormat?: string | null;
    createdAt?: string | null;
};

export default function HistoryPage() {
    const [items, setItems] = useState([] as Conversion[]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(null as Conversion | null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/api/conversions/history');
            setItems(res.data || []);
        } catch (e: unknown) {
            const errorData = (e as { response?: { data?: { error?: string } } }).response?.data;
            toast.error(errorData?.error || 'Failed to load conversion history');
        } finally {
            setIsLoading(false);
        }
    };

    // Pagination helpers (client-side)
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const paged = items.slice((page - 1) * pageSize, page * pageSize);

    const openDetails = (c: Conversion) => setSelected(c);
    const closeDetails = () => setSelected(null);

    const downloadOutput = (c: Conversion) => {
        if (!c.outputContent) {
            toast.error('No output available to download');
            return;
        }
        const isXml = c.outputContent.trim().startsWith('<');
        const ext = isXml ? 'xml' : 'txt';
        const blob = new Blob([c.outputContent], { type: isXml ? 'application/xml' : 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `conversion-${c.id}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    const deleteConversion = async (c: Conversion) => {
        try {
            await api.delete(`/api/conversions/${c.id}`);
            setItems((prev: Conversion[]) => prev.filter((p: Conversion) => p.id !== c.id));
            toast.success('Conversion deleted');
        } catch (e: unknown) {
            const status = (e as { response?: { status?: number } }).response?.status;
            if (status === 404 || status === 405) {
                toast.error('Delete not supported by server');
            } else {
                toast.error('Failed to delete conversion');
            }
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">History</h1>
                <p className="text-gray-500">Your past message conversions</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16">
                        <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900 mb-1">No conversions yet</p>
                        <p className="text-sm text-gray-500">Your past conversions will appear here</p>
                    </div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{total} conversions</span>
                                <div className="flex items-center space-x-2">
                                    <select 
                                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                                        value={pageSize} 
                                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                                    >
                                        <option value={5}>5 per page</option>
                                        <option value={10}>10 per page</option>
                                        <option value={20}>20 per page</option>
                                    </select>
                                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                                    <div className="flex items-center space-x-1">
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 w-8 p-0"
                                            onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            className="h-8 w-8 p-0"
                                            onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                                        <th className="px-6 py-3 font-medium">Date</th>
                                        <th className="px-6 py-3 font-medium">Type</th>
                                        <th className="px-6 py-3 font-medium">Formats</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paged.map((c: Conversion) => (
                                        <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {c.createdAt ? new Date(c.createdAt).toLocaleString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{c.conversionType}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                <span className="text-blue-600">{c.sourceFormat || '-'}</span>
                                                <span className="mx-2 text-gray-400">→</span>
                                                <span className="text-indigo-600">{c.targetFormat || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                                    c.status === 'SUCCESS' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : c.status === 'FAILED' 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-8 text-gray-600 hover:text-gray-900"
                                                        onClick={() => openDetails(c)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" /> View
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-8 text-gray-600 hover:text-gray-900"
                                                        onClick={() => downloadOutput(c)}
                                                    >
                                                        <Download className="w-4 h-4 mr-1" /> Download
                                                    </Button>
                                                    <Button 
                                                        size="sm" 
                                                        variant="ghost" 
                                                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => deleteConversion(c)}
                                                    >
                                                        <Trash className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Conversion Details</h3>
                                    <p className="text-xs text-gray-500">{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => downloadOutput(selected)}>
                                    <Download className="w-4 h-4 mr-1" /> Download
                                </Button>
                                <Button variant="ghost" size="sm" onClick={closeDetails}>
                                    ✕
                                </Button>
                            </div>
                        </div>
                        <div className="p-4 overflow-auto flex-1">
                            <div className="mb-4">
                                <span className="text-xs text-gray-500">Type</span>
                                <p className="font-medium text-gray-900">{selected.conversionType}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">Input</span>
                                    <pre className="mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-64 overflow-auto text-xs text-gray-700 whitespace-pre-wrap">
                                        {selected.inputContent || '(empty)'}
                                    </pre>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Output</span>
                                    <pre className="mt-1 bg-gray-50 border border-gray-200 rounded-lg p-3 max-h-64 overflow-auto text-xs text-gray-700 whitespace-pre-wrap">
                                        {selected.outputContent || '(empty)'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
