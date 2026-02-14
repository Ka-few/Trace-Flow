import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    ArrowLeft,
    Split,
    RotateCcw,
    History,
    TreePine,
    Building2,
    MapPin,
    Dna,
    Calendar,
    FileText,
    Box,
    CheckCircle as CheckCircleIcon
} from 'lucide-react'
import { useBatch } from '../../hooks/useBatches'
import SplitBatchModal from './SplitBatchModal'
import type { BatchStatus } from '../../types/batch'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const statusSteps: BatchStatus[] = [
    'Created',
    'ReadyForTransfer',
    'InTransit',
    'Received',
    'Processing',
    'Processed',
    'Sold',
    'Closed'
]

const BatchDetail = () => {
    const { id } = useParams<{ id: string }>()
    const { data: batch, isLoading } = useBatch(id!)
    const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)

    if (isLoading) return <div className="p-12 text-center text-gray-500 font-medium tracking-tight">Loading batch intelligence...</div>
    if (!batch) return <div className="p-12 text-center text-red-500 font-medium">Batch not found in registry.</div>

    const currentStepIndex = statusSteps.indexOf(batch.status)

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Detail Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/batches" className="p-2 hover:bg-white rounded-full border border-transparent hover:border-gray-200 transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{batch.publicToken}</h2>
                            <span className={cn(
                                "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm",
                                batch.status === 'Recalled' ? "bg-red-50 text-red-700 border-red-200" : "bg-primary-50 text-primary-700 border-primary-200"
                            )}>
                                {batch.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Dna className="w-4 h-4" />
                            Genetic/Product: <span className="font-semibold text-gray-700">{batch.productType}</span> •
                            ID: <span className="font-mono text-[11px]">{batch.id}</span>
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                        <History className="w-4 h-4" />
                        Audit Log
                    </button>
                    <button
                        onClick={() => setIsSplitModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                    >
                        <Split className="w-4 h-4" />
                        Split Batch
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-danger text-white rounded-md text-sm font-bold hover:bg-red-700 shadow-sm transition-all">
                        <RotateCcw className="w-4 h-4" />
                        Recall Batch
                    </button>
                </div>
            </div>

            {/* Status Timeline */}
            <div className="erp-card p-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Asset Lifecycle Progress</h3>
                <div className="relative">
                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full" />
                    <div
                        className="absolute top-5 left-0 h-1 bg-primary-600 rounded-full transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex justify-between">
                        {statusSteps.map((step, idx) => {
                            const isPast = idx < currentStepIndex
                            const isCurrent = idx === currentStepIndex
                            const isRecalled = batch.status === 'Recalled'

                            return (
                                <div key={step} className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full border-4 z-10 flex items-center justify-center transition-all bg-white",
                                        isPast ? "border-primary-600 text-primary-600" :
                                            isCurrent ? (isRecalled ? "border-danger text-danger scale-110" : "border-primary-600 text-primary-600 scale-110 shadow-lg shadow-primary-500/20") :
                                                "border-gray-100 text-gray-300"
                                    )}>
                                        {isPast ? <CheckCircleIcon className="w-5 h-5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px]",
                                        isCurrent ? "text-gray-900" : "text-gray-400"
                                    )}>
                                        {step.replace(/([A-Z])/g, ' $1').trim()}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Core Attributes */}
                <div className="space-y-6">
                    <div className="erp-card">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Asset Summary
                            </h4>
                        </div>
                        <div className="p-4 space-y-4">
                            <AttributeRow label="Quantity" value={`${batch.quantity} ${batch.unitOfMeasure}`} icon={Box} highlight />
                            <AttributeRow label="Organization" value="Global Agriculture Corp" icon={Building2} />
                            <AttributeRow label="Production Site" value={batch.siteName || "Central Facility"} icon={MapPin} />
                            <AttributeRow label="Harvest Date" value={new Date(batch.harvestDate).toLocaleDateString()} icon={Calendar} />
                        </div>
                    </div>

                    <div className="erp-card p-4 bg-primary-900 text-white">
                        <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">Public Verification URL</p>
                        <div className="flex items-center gap-2 bg-primary-800 p-2 rounded border border-primary-700">
                            <span className="text-[11px] font-mono truncate">https://traceflow.io/track/{batch.publicToken}</span>
                            <button className="text-[10px] font-bold text-primary-300 hover:text-white underline">Copy</button>
                        </div>
                    </div>
                </div>

                {/* Lineage Analysis */}
                <div className="lg:col-span-2 erp-card">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <TreePine className="w-4 h-4 text-gray-400" />
                            Lineage & Pedigree
                        </h4>
                        <div className="flex gap-2">
                            <span className="text-[10px] px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-500 font-bold">DAG ANALYZED</span>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="border border-gray-100 rounded-lg p-6 bg-gray-50/30 flex flex-col items-center justify-center min-h-[300px] text-center">
                            <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                                <TreePine className="w-12 h-12 text-primary-200" />
                            </div>
                            <h5 className="text-sm font-bold text-gray-900 mb-1">Lineage Tree View</h5>
                            <p className="text-xs text-gray-500 max-w-xs mb-6">Interactive graphical relationship mapping for parents and children.</p>

                            <div className="w-full text-left space-y-2">
                                <LineageItem label="Parent Batches" count={batch.parents?.length || 0} />
                                <LineageItem label="Child Splits" count={batch.children?.length || 0} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SplitBatchModal
                batch={batch}
                isOpen={isSplitModalOpen}
                onClose={() => setIsSplitModalOpen(false)}
                onSuccess={() => {
                    // Refetch data or show success toast
                    console.log('Split successful')
                }}
            />
        </div>
    )
}

const AttributeRow = ({ label, value, icon: Icon, highlight }: any) => (
    <div className="flex justify-between items-center py-1">
        <div className="flex items-center gap-2 text-gray-500">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className={cn(
            "text-sm font-semibold",
            highlight ? "text-primary-700" : "text-gray-900"
        )}>{value}</span>
    </div>
)

const LineageItem = ({ label, count }: any) => (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded shadow-sm">
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-tight">{label}</span>
        </div>
        <span className="text-xs font-black text-primary-900">{count}</span>
    </div>
)

export default BatchDetail
