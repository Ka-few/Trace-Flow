import {
    Factory,
    Play,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    FlaskConical,
    Wind
} from 'lucide-react'
import { useBatches } from '../../hooks/useBatches'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../api/client'


const ProcessingModule = () => {
    const queryClient = useQueryClient()
    const { data: batches, isLoading } = useBatches({ status: 'Processing' })
    const { data: receivedBatches } = useBatches({ status: 'Received' })

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }: { id: string, status: string }) => {
            await api.put(`/batches/${id}/status`, { batchId: id, newStatus: status })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['batches'] })
        }
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Industrial Processing</h2>
                    <p className="text-sm text-gray-500 font-medium">Active transformation and refining queue.</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500">
                                {String.fromCharCode(64 + i)}
                            </div>
                        ))}
                    </div>
                    <button className="erp-button-primary !py-1.5 flex items-center gap-2">
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Start Shift
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Processing Queue */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Factory className="w-4 h-4" />
                            Processing Underway
                        </h3>
                        <span className="text-[10px] font-black bg-primary-900 text-white px-2 py-0.5 rounded-full animate-pulse">
                            {batches?.items.length || 0} ACTIVE
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {isLoading ? (
                            [1, 2].map(i => <div key={i} className="h-40 bg-gray-50 border border-gray-100 rounded-xl animate-pulse" />)
                        ) : batches?.items.length === 0 ? (
                            <div className="p-12 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                                <FlaskConical className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-bold text-gray-400 uppercase">Production line idle</p>
                            </div>
                        ) : (
                            batches?.items.map(batch => (
                                <div key={batch.id} className="erp-card p-6 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary-600" />
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-black text-gray-900 tracking-tight">{batch.publicToken}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full border border-indigo-100 uppercase">TRANSFORMING</span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 flex items-center gap-2">
                                                <Wind className="w-3.5 h-3.5" />
                                                Refining to <span className="text-gray-900">Processed Grade A</span>
                                            </p>
                                        </div>
                                        <button className="p-1.5 text-gray-300 hover:text-gray-900 transition-colors">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="mt-6 flex items-end justify-between">
                                        <div className="space-y-3 flex-1 max-w-xs">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Progress</span>
                                                <span className="text-primary-600">65%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary-600 w-[65%] rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => updateStatus.mutate({ id: batch.id, status: 'Processed' })}
                                            className="erp-button-primary !py-2 !px-4 !bg-emerald-600 hover:!bg-emerald-700 border-none flex items-center gap-2"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            Complete Work
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Ready to Process (Inbox) */}
                <div className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Input Queue
                    </h3>
                    <div className="space-y-2">
                        {receivedBatches?.items.map(batch => (
                            <div key={batch.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-primary-200 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="text-xs font-black text-gray-900 leading-none mb-1">{batch.publicToken}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{batch.quantity} {batch.unitOfMeasure}</p>
                                    </div>
                                    <button
                                        onClick={() => updateStatus.mutate({ id: batch.id, status: 'Processing' })}
                                        className="p-2 bg-gray-50 text-gray-400 hover:bg-primary-900 hover:text-white rounded-lg transition-all group-hover:shadow-lg"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded bg-amber-50 flex items-center justify-center">
                                        <Clock className="w-3 h-3 text-amber-600" />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">Received {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                        {receivedBatches?.items.length === 0 && (
                            <p className="p-8 text-center text-xs font-bold text-gray-300 uppercase tracking-widest border border-dashed rounded-xl">Queue Empty</p>
                        )}
                    </div>

                    <div className="erp-card p-4 bg-gray-900 text-white mt-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3">Quick Analytics</h4>
                        <div className="space-y-4">
                            <AnalyticsRow label="Daily Output" value="1,240 kg" />
                            <AnalyticsRow label="Efficiency" value="94.2%" />
                            <AnalyticsRow label="Wastage" value="2.1%" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AnalyticsRow = ({ label, value }: any) => (
    <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase">{label}</span>
        <span className="text-xs font-black">{value}</span>
    </div>
)

const Clock = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)

export default ProcessingModule
