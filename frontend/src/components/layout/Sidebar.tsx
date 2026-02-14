import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Layers,
    ArrowLeftRight,
    Cpu,
    Share2,
    ShieldCheck,
    Database,
    Box
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Batches', icon: Box, path: '/batches' },
    { name: 'Transfers', icon: ArrowLeftRight, path: '/transfers' },
    { name: 'Processing', icon: Cpu, path: '/processing' },
    { name: 'Lineage Explorer', icon: Share2, path: '/lineage' },
    { name: 'Compliance', icon: ShieldCheck, path: '/compliance' },
    { name: 'Master Data', icon: Database, path: '/master-data' },
]

const Sidebar = () => {
    return (
        <aside className="w-64 bg-primary-900 text-primary-50 flex flex-col shadow-xl z-20">
            <div className="p-6 flex items-center gap-3 border-b border-primary-800/50">
                <div className="bg-white p-1.5 rounded-lg">
                    <Layers className="w-6 h-6 text-primary-900" />
                </div>
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-white">TraceFlow</h1>
                    <p className="text-[10px] uppercase font-semibold text-primary-400 tracking-widest">Enterprise ERP</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
                            isActive
                                ? "bg-primary-800 text-white shadow-sm"
                                : "text-primary-300 hover:bg-primary-800/50 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            "group-hover:text-white"
                        )} />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-primary-800/50">
                <div className="bg-primary-800/30 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider mb-1">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs font-medium text-primary-100">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
