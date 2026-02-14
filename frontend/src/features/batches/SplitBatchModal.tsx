import { useState } from 'react'
import { X, Plus, Trash2, Box, AlertCircle } from 'lucide-react'
import type { BatchDto, BatchSplitDefinition } from '../../types/batch'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface SplitBatchModalProps {
    batch: BatchDto
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

const SplitBatchModal = ({ batch, isOpen, onClose, onSuccess }: SplitBatchModalProps) => {
    const [splits, setSplits] = useState<BatchSplitDefinition[]>([
        { quantity: 0, productType: batch.productType, strainOrVariety: batch.strainOrVariety }
    ])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const totalSplitQuantity = splits.reduce((acc, s) => acc + (Number(s.quantity) || 0), 0)
    const isOverQuantity = totalSplitQuantity > batch.quantity

    const addSplit = () => {
        setSplits([...splits, {
            quantity: 0,
            productType: batch.productType,
            strainOrVariety: batch.strainOrVariety
        }])
    }

    const removeSplit = (index: number) => {
        setSplits(splits.filter((_, i) => i !== index))
    }

    const updateSplit = (index: number, field: keyof BatchSplitDefinition, value: any) => {
        const newSplits = [...splits]
        newSplits[index] = { ...newSplits[index], [field]: value }
        setSplits(newSplits)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isOverQuantity) return

        setIsSubmitting(true)
        setError(null)

        try {
            // API Call Placeholder
            console.log('Splitting batch:', { sourceBatchId: batch.id, splits })
            // await api.post('/batches/split', { sourceBatchId: batch.id, splits })

            setTimeout(() => {
                setIsSubmitting(false)
                onSuccess()
                onClose()
            }, 1000)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to split batch')
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Divide & Split Batch</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Source: {batch.publicToken}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-gray-200">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Source Status */}
                    <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg border border-primary-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded shadow-sm">
                                <Box className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest leading-none mb-1">Available Inventory</p>
                                <p className="text-sm font-bold text-primary-900">{batch.quantity} {batch.unitOfMeasure}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest leading-none mb-1">Allocated</p>
                            <p className={cn(
                                "text-sm font-bold",
                                isOverQuantity ? "text-danger" : "text-primary-700"
                            )}>
                                {totalSplitQuantity.toFixed(2)} {batch.unitOfMeasure}
                            </p>
                        </div>
                    </div>

                    {isOverQuantity && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs font-bold text-danger animate-in slide-in-from-top-2">
                            <AlertCircle className="w-4 h-4" />
                            Insufficient quantity in source batch to perform these splits.
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-xs font-bold text-danger">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Splits List */}
                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                        {splits.map((split, idx) => (
                            <div key={idx} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm space-y-4 group relative">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Child Output #{idx + 1}</span>
                                    {splits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSplit(idx)}
                                            className="p-1.5 text-gray-400 hover:text-danger hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quantity</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            required
                                            value={split.quantity}
                                            onChange={(e) => updateSplit(idx, 'quantity', parseFloat(e.target.value))}
                                            className="erp-input"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product Type Override</label>
                                        <input
                                            type="text"
                                            value={split.productType}
                                            onChange={(e) => updateSplit(idx, 'productType', e.target.value)}
                                            className="erp-input"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Strain/Variety</label>
                                        <input
                                            type="text"
                                            value={split.strainOrVariety}
                                            onChange={(e) => updateSplit(idx, 'strainOrVariety', e.target.value)}
                                            className="erp-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addSplit}
                        className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Another Split Definition
                    </button>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || isOverQuantity || splits.length === 0}
                            className="erp-button-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? 'Processing Audit Trail...' : 'Confirm Divisional Split'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SplitBatchModal
