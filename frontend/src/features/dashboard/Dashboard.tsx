import {
    Box,
    ArrowLeftRight,
    Cpu,
    AlertTriangle,
    CheckCircle2,
    Clock
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="erp-card p-4 flex flex-col justify-between group hover:border-primary-300 transition-colors">
        <div className="flex justify-between items-start mb-2">
            <div className={cn("p-2 rounded-lg", color)}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded",
                    trend.type === 'up' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}>
                    {trend.value}
                </span>
            )}
        </div>
        <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
    </div>
)

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Operations Overview</h2>
                    <p className="text-sm text-gray-500">Real-time status of all active supply chain batches.</p>
                </div>
                <div className="flex gap-2">
                    <button className="text-xs font-semibold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 px-3 py-1.5 rounded-md shadow-sm transition-all hover:bg-gray-50">
                        Export Report
                    </button>
                    <button className="erp-button-primary text-xs !py-1.5">
                        Create Batch
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Batches"
                    value="1,284"
                    icon={Box}
                    color="bg-primary-100 text-primary-700"
                    trend={{ value: "+12%", type: 'up' }}
                />
                <StatCard
                    title="In Transit"
                    value="42"
                    icon={ArrowLeftRight}
                    color="bg-warning/10 text-warning"
                />
                <StatCard
                    title="Processing"
                    value="18"
                    icon={Cpu}
                    color="bg-info/10 text-info"
                    trend={{ value: "-5%", type: 'down' }}
                />
                <StatCard
                    title="Risk/Recalled"
                    value="3"
                    icon={AlertTriangle}
                    color="bg-danger/10 text-danger"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 erp-card">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                        <h4 className="text-sm font-bold text-gray-900">Recent Tracking Activity</h4>
                        <button className="text-[10px] font-bold text-primary-600 uppercase tracking-wider hover:underline">View All</button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-gray-900">Batch #TF-9283-A</span> status updated to <span className="text-success font-medium">Processed</span>
                                    </p>
                                    <p className="text-[11px] text-gray-500">Facility: North Processing Plant • 2 hours ago</p>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-success" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Site Distribution */}
                <div className="erp-card">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <h4 className="text-sm font-bold text-gray-900">Asset Distribution</h4>
                    </div>
                    <div className="p-4 space-y-4">
                        {[
                            { name: 'North Site', val: 75, color: 'bg-primary-600' },
                            { name: 'Eastern Hub', val: 45, color: 'bg-info' },
                            { name: 'Central facility', val: 90, color: 'bg-success' },
                            { name: 'In Transit', val: 15, color: 'bg-warning' },
                        ].map(site => (
                            <div key={site.name} className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                                    <span className="text-gray-500">{site.name}</span>
                                    <span className="text-gray-900">{site.val}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full", site.color)} style={{ width: `${site.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
