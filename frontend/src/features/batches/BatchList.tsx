import { Link } from 'react-router-dom'
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Box
} from 'lucide-react'
import { useBatches } from '../../hooks/useBatches'
import type { BatchStatus } from '../../types/batch'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const statusConfig: Record<BatchStatus, { color: string, label: string }> = {
    Created: { color: "bg-gray-100 text-gray-600 border-gray-200", label: "Created" },
    ReadyForTransfer: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Ready" },
    InTransit: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "In Transit" },
    Received: { color: "bg-cyan-50 text-cyan-700 border-cyan-200", label: "Received" },
    Processing: { color: "bg-indigo-50 text-indigo-700 border-indigo-200", label: "Processing" },
    Processed: { color: "bg-green-50 text-green-700 border-green-200", label: "Processed" },
    Sold: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "Sold" },
    Recalled: { color: "bg-red-50 text-red-700 border-red-200", label: "Recalled" },
    Closed: { color: "bg-slate-200 text-slate-700 border-slate-300", label: "Closed" },
}

const BatchList = () => {
    const { data, isLoading } = useBatches({})

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Batch Management</h2>
                    <p className="text-sm text-gray-500">Inventory tracking and lifecycle management.</p>
                </div>
                <button className="erp-button-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create New Batch
                </button>
            </div>

            <div className="erp-card">
                {/* Table Filters/Actions */}
                <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Filter by token or product..."
                                className="erp-input pl-10 w-64 !bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                                <Filter className="w-3.5 h-3.5" />
                                Status
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                                Site
                            </button>
                        </div>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">
                        Showing <span className="text-gray-900 font-bold">{data?.items.length || 0}</span> of <span className="text-gray-900 font-bold">{data?.totalCount || 0}</span> entries
                    </div>
                </div>

                {/* Dense ERP Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="erp-table-header w-12 text-center select-none">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                </th>
                                <th className="erp-table-header">Public Token</th>
                                <th className="erp-table-header">Product Type</th>
                                <th className="erp-table-header">Quantity</th>
                                <th className="erp-table-header">Site</th>
                                <th className="erp-table-header">Harvest Date</th>
                                <th className="erp-table-header">Status</th>
                                <th className="erp-table-header text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={8} className="erp-table-cell !py-4 h-12 bg-gray-50/30"></td>
                                    </tr>
                                ))
                            ) : data?.items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Box className="w-12 h-12 opacity-20" />
                                            <p className="text-sm font-medium">No batches found matching your criteria.</p>
                                            <button className="text-xs font-bold text-primary-600 hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data?.items.map((batch) => (
                                    <tr key={batch.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="erp-table-cell text-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                                        </td>
                                        <td className="erp-table-cell font-mono text-[11px] font-bold text-gray-900">
                                            <div className="flex items-center gap-2">
                                                {batch.publicToken}
                                                <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-primary-600 transition-all">
                                                    <ExternalLink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="erp-table-cell font-semibold text-gray-900">{batch.productType}</td>
                                        <td className="erp-table-cell">
                                            <span className="font-bold text-gray-900">{batch.quantity}</span>
                                            <span className="text-[10px] font-bold text-gray-400 ml-1 uppercase">{batch.unitOfMeasure}</span>
                                        </td>
                                        <td className="erp-table-cell text-xs font-medium text-gray-600">{batch.siteName || 'Not Specified'}</td>
                                        <td className="erp-table-cell text-xs text-gray-500">
                                            {new Date(batch.harvestDate).toLocaleDateString()}
                                        </td>
                                        <td className="erp-table-cell">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                                statusConfig[batch.status].color
                                            )}>
                                                {statusConfig[batch.status].label.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="erp-table-cell text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <Link
                                                    to={`/batches/${batch.id}`}
                                                    className="px-2 py-1 text-[11px] font-bold text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                                >
                                                    View Details
                                                </Link>
                                                <button className="p-1 hover:text-gray-900 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Page Navigation */}
                <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <div className="text-xs text-gray-500 font-medium">
                        Page <span className="text-gray-900 font-bold">{data?.pageNumber || 1}</span> of <span className="text-gray-900 font-bold">{data?.totalPages || 1}</span>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-1.5 border border-gray-200 rounded-md bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 border border-gray-200 rounded-md bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BatchList
