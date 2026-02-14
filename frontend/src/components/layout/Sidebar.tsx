import { NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard,
    Box,
    ArrowLeftRight,
    Factory,
    Network,
    ShieldCheck,
    Settings,
    Layers,
    LogOut,
    Building2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '../../features/auth/AuthContext'
import RBACGuard from '../../features/auth/RBACGuard'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Sidebar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="w-64 bg-primary-900 text-white flex flex-col shrink-0">
            {/* Brand Section */}
            <div className="p-6 flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tight leading-none">TraceFlow</h1>
                    <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">Enterprise ERP</span>
                </div>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 px-3 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                <div>
                    <p className="px-3 mb-4 text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Core Operations</p>
                    <div className="space-y-1">
                        <SidebarLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <SidebarLink to="/batches" icon={Box} label="Batch Management" />
                        <SidebarLink to="/transfers" icon={ArrowLeftRight} label="Transfers" />
                        <SidebarLink to="/processing" icon={Factory} label="Processing" />
                    </div>
                </div>

                <div>
                    <p className="px-3 mb-4 text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Traceability</p>
                    <div className="space-y-1">
                        <SidebarLink to="/lineage" icon={Network} label="Lineage Explorer" />
                        <RBACGuard allowedRoles={['Admin']}>
                            <SidebarLink to="/compliance" icon={ShieldCheck} label="Compliance Audit" />
                        </RBACGuard>
                    </div>
                </div>

                <div>
                    <p className="px-3 mb-4 text-[10px] font-bold text-primary-500 uppercase tracking-[0.2em]">Global</p>
                    <div className="space-y-1">
                        <RBACGuard allowedRoles={['Admin']}>
                            <SidebarLink to="/master-data" icon={Layers} label="Master Data" />
                        </RBACGuard>
                        <SidebarLink to="/settings" icon={Settings} label="System Settings" />
                    </div>
                </div>
            </nav>

            {/* Organization / User Section */}
            <div className="p-4 bg-black/20 border-t border-white/5">
                <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="w-10 h-10 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold ring-2 ring-white/10 shadow-lg">
                        {user?.fullName?.split(' ').map((n: string) => n[0]).join('') || '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate leading-none mb-1">{user?.fullName}</p>
                        <p className="text-[10px] text-primary-400 font-bold uppercase tracking-wider truncate flex items-center gap-1">
                            <Building2 className="w-2.5 h-2.5" />
                            {user?.role}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-primary-300 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-transparent hover:border-white/10"
                >
                    <LogOut className="w-4 h-4" />
                    Terminate Session
                </button>
            </div>

            {/* Environment Badge */}
            <div className="px-6 py-2 bg-primary-800/50 flex justify-between items-center text-[10px] font-bold text-primary-500 uppercase tracking-widest border-t border-white/5">
                <span>v1.0.4-dev</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50" />
                    Connected
                </div>
            </div>
        </aside>
    )
}

interface SidebarLinkProps {
    to: string;
    icon: any;
    label: string;
}

const SidebarLink = ({ to, icon: Icon, label }: SidebarLinkProps) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 group relative",
                isActive
                    ? "bg-white text-primary-900 shadow-md translate-x-1"
                    : "text-primary-300 hover:text-white hover:bg-white/5"
            )}
        >
            {({ isActive }) => (
                <>
                    <Icon className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-primary-900" : "text-primary-400"
                    )} />
                    {label}
                    {isActive && (
                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-600 animate-in zoom-in" />
                    )}
                </>
            )}
        </NavLink>
    )
}

export default Sidebar
