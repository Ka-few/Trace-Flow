import { useState } from 'react'
import {
    Network,
    Search,
    ChevronRight,
    ChevronDown,
    Box,
    ArrowRight,
    Filter
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface TreeNodeProps {
    label: string
    subLabel?: string
    quantity: string
    children?: React.ReactNode
    isRoot?: boolean
}

const TreeNode = ({ label, subLabel, quantity, children, isRoot }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const hasChildren = !!children

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-md transition-colors cursor-pointer group",
                    isRoot ? "bg-primary-50 border border-primary-200" : "hover:bg-gray-50"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-1.5 min-w-[200px]">
                    {hasChildren ? (
                        isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />
                    ) : (
                        <div className="w-4" />
                    )}
                    <Box className={cn("w-4 h-4", isRoot ? "text-primary-600" : "text-gray-400")} />
                    <span className={cn("text-sm transition-colors", isRoot ? "font-bold text-primary-900" : "font-medium text-gray-700 group-hover:text-primary-600")}>
                        {label}
                    </span>
                </div>

                <div className="flex-1 flex items-center gap-4">
                    {subLabel && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{subLabel}</span>}
                    <div className="h-px flex-1 bg-gray-100 hidden md:block" />
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-gray-900">{quantity}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">KG</span>
                    </div>
                </div>
            </div>

            {hasChildren && isOpen && (
                <div className="ml-6 pl-2 border-l border-gray-100 mt-1 space-y-1">
                    {children}
                </div>
            )}
        </div>
    )
}

const LineageExplorer = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Lineage Explorer</h2>
                    <p className="text-sm text-gray-500">Trace inheritance and multi-level batch genealogy.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-600 hover:bg-gray-50">
                        <Filter className="w-3.5 h-3.5" />
                        Depth: 3
                    </button>
                    <button className="erp-button-primary !py-1.5 text-xs flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        D3 Graph View
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Search & Navigation Sidebar */}
                <div className="erp-card h-fit">
                    <div className="p-4 border-b border-gray-100">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Search Token..." className="erp-input pl-10" />
                        </div>
                    </div>
                    <div className="p-2">
                        <p className="p-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Explorations</p>
                        {[1, 2, 3].map(i => (
                            <button key={i} className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-between group">
                                TF-9283-A
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all text-primary-600" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Hierarchical Tree Area */}
                <div className="lg:col-span-3 erp-card min-h-[500px] p-6">
                    <div className="mb-6 pb-4 border-b border-gray-100 flex items-center gap-2 text-gray-400">
                        <Network className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Ancestry Propagation Tree</span>
                    </div>

                    <div className="space-y-4">
                        <TreeNode label="ROOT: TF-0012-P" subLabel="Primary Harvest" quantity="500.00" isRoot>
                            <TreeNode label="TF-0012-S1" subLabel="Split: Flower" quantity="200.00">
                                <TreeNode label="TF-0012-S1-P1" subLabel="Packaging: 1oz" quantity="50.00" />
                                <TreeNode label="TF-0012-S1-P2" subLabel="Packaging: 1/8oz" quantity="150.00" />
                            </TreeNode>
                            <TreeNode label="TF-0012-S2" subLabel="Split: Trim" quantity="300.00">
                                <TreeNode label="TF-0012-S2-X1" subLabel="Extraction Input" quantity="250.00">
                                    <TreeNode label="TF-EXT-99" subLabel="Distillate Batch" quantity="25.00" />
                                </TreeNode>
                                <TreeNode label="TF-0012-S2-W1" subLabel="Waste/Biomass" quantity="50.00" />
                            </TreeNode>
                        </TreeNode>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LineageExplorer
