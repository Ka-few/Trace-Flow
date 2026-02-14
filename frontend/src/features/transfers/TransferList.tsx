import { useState } from 'react'
import {
    ArrowLeftRight,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Building2,
    Box
} from 'lucide-react'
import { useTransfers } from '../../hooks/useTransfers'
import type { TransferStatus } from '../../types/transfer'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '../auth/AuthContext'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const statusConfig: Record<TransferStatus, { color: string, icon: any, label: string }> = {
    Pending: { color: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock, label: "Awaiting Response" },
    Completed: { color: "bg-green-50 text-green-700 border-green-200", icon: CheckCircle2, label: "Transfer Success" },
    Cancelled: { color: "bg-gray-100 text-gray-500 border-gray-200", icon: XCircle, label: "Cancelled" },
    Rejected: { color: "bg-red-50 text-red-700 border-red-200", icon: XCircle, label: "Rejected" },
}

const TransferList = () => {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')
    const { data: transfers, isLoading } = useTransfers()

    const filteredTransfers = transfers?.filter(t =>
        activeTab === 'incoming'
            ? t.destinationOrganizationId === user?.organizationId
            : t.sourceOrganizationId === user?.organizationId
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Supply Chain Transfers</h2>
                    <p className="text-sm text-gray-500 font-medium">Coordinate inventory movement across organizations.</p>
                </div>
                <button className="erp-button-primary flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Initiate New Movement
                </button>
            </div>

            <div className="flex gap-1 p-1 bg-gray-100/80 rounded-xl w-fit border border-gray-200 shadow-sm">
                <TabButton
                    active={activeTab === 'incoming'}
                    onClick={() => setActiveTab('incoming')}
                    label="Incoming Assets"
                    count={transfers?.filter(t => t.destinationOrganizationId === user?.organizationId && t.status === 'Pending').length}
                />
                <TabButton
                    active={activeTab === 'outgoing'}
                    onClick={() => setActiveTab('outgoing')}
                    label="Outgoing Shipments"
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />)
                ) : filteredTransfers?.length === 0 ? (
                    <div className="erp-card p-12 text-center flex flex-col items-center gap-4 border-dashed border-2">
                        <div className="p-4 bg-gray-50 rounded-full">
                            <ArrowLeftRight className="w-8 h-8 text-gray-300" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">No active transfers found</p>
                            <p className="text-xs text-gray-400 mt-1">There are no movements matching your current filter.</p>
                        </div>
                    </div>
                ) : (
                    filteredTransfers?.map(transfer => (
                        <div key={transfer.id} className="erp-card group hover:border-primary-200 transition-all hover:shadow-lg hover:shadow-primary-900/5">
                            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center border",
                                        activeTab === 'incoming' ? "bg-indigo-50 border-indigo-100 text-indigo-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                    )}>
                                        <ArrowLeftRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-sm font-black text-gray-900">{transfer.batchPublicToken}</span>
                                            <StatusBadge status={transfer.status} />
                                        </div>
                                        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 className="w-3 h-3" />
                                                {activeTab === 'incoming' ? transfer.sourceOrganizationName : transfer.destinationOrganizationName}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Box className="w-3 h-3" />
                                                {transfer.quantity} {transfer.unitOfMeasure}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 ml-auto">
                                    <div className="text-right mr-4 hidden lg:block">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Initiated</p>
                                        <p className="text-xs font-bold text-gray-700">{new Date(transfer.initiatedAt).toLocaleDateString()}</p>
                                    </div>
                                    {transfer.status === 'Pending' && activeTab === 'incoming' && (
                                        <>
                                            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors">
                                                Reject
                                            </button>
                                            <button className="px-4 py-2 bg-primary-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-all shadow-md shadow-primary-900/10 flex items-center gap-2">
                                                Accept Shipment
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    )}
                                    {transfer.status === 'Pending' && activeTab === 'outgoing' && (
                                        <button className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors">
                                            Cancel Transfer
                                        </button>
                                    )}
                                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

const TabButton = ({ active, onClick, label, count }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "px-6 py-2 text-xs font-bold transition-all flex items-center gap-2",
            active ? "bg-white text-primary-900 rounded-lg shadow-sm ring-1 ring-gray-200" : "text-gray-500 hover:text-gray-900"
        )}
    >
        {label}
        {count !== undefined && count > 0 && (
            <span className="w-5 h-5 bg-primary-900 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse">
                {count}
            </span>
        )}
    </button>
)

const StatusBadge = ({ status }: { status: TransferStatus }) => {
    const config = statusConfig[status]
    const Icon = config.icon
    return (
        <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5",
            config.color
        )}>
            <Icon className="w-3 h-3" />
            {config.label.toUpperCase()}
        </span>
    )
}

export default TransferList
