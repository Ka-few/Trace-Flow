import { useState } from 'react'
import {
    Users,
    Building2,
    Shield,
    Mail,
    Globe,
    Plus,
    MoreVertical
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import RBACGuard from '../auth/RBACGuard'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const SettingsModule = () => {
    const { } = useAuth()
    const [activeTab, setActiveTab] = useState<'general' | 'users' | 'security'>('general')

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage organization profile, team members, and security policies.</p>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Navigation Sidebar */}
                <div className="w-64 space-y-1">
                    <SettingsTabButton
                        active={activeTab === 'general'}
                        onClick={() => setActiveTab('general')}
                        icon={Building2}
                        label="Organization Profile"
                    />
                    <SettingsTabButton
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                        icon={Users}
                        label="User Management"
                    />
                    <SettingsTabButton
                        active={activeTab === 'security'}
                        onClick={() => setActiveTab('security')}
                        icon={Shield}
                        label="Security & RBAC"
                    />
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    {activeTab === 'general' && <GeneralSettings orgName="Global Agriculture Corp Ltd." />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'security' && <SecuritySettings />}
                </div>
            </div>
        </div>
    )
}

const GeneralSettings = ({ orgName }: { orgName: string }) => (
    <div className="erp-card p-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary-600" />
            Canonical Information
        </h3>
        <div className="space-y-6 max-w-xl">
            <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Legal Entity Name</label>
                <input type="text" value={orgName} readOnly className="erp-input !bg-gray-50 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Primary Domain</label>
                    <div className="relative">
                        <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value="global-agri.com" className="erp-input pl-10" />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Email</label>
                    <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value="ops@global-agri.com" className="erp-input pl-10" />
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="erp-button-primary !py-2 !px-6">Save Changes</button>
            </div>
        </div>
    </div>
)

const UserManagement = () => (
    <RBACGuard allowedRoles={['Admin']} fallback={
        <div className="erp-card p-12 text-center text-gray-500 font-bold uppercase tracking-wider">
            Access Restricted to Administrative Personnel
        </div>
    }>
        <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Authorized Personnel</h3>
                <button className="flex items-center gap-2 text-[10px] font-black text-primary-700 hover:text-primary-900 uppercase">
                    <Plus className="w-3.5 h-3.5" />
                    Invite Member
                </button>
            </div>
            <div className="erp-card overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Role</th>
                            <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                            <th className="px-4 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        <UserRow name="Jane Doe" role="Admin" status="Active" isCurrent />
                        <UserRow name="John Smith" role="Producer" status="Active" />
                        <UserRow name="Mark Wilson" role="Aggregator" status="Inactive" />
                    </tbody>
                </table>
            </div>
        </div>
    </RBACGuard>
)

const UserRow = ({ name, role, status, isCurrent }: any) => (
    <tr className="hover:bg-gray-50/50 transition-colors">
        <td className="px-4 py-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700">
                    {name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                    <p className="text-xs font-bold text-gray-900">{name} {isCurrent && <span className="ml-2 px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] rounded uppercase font-black">YOU</span>}</p>
                    <p className="text-[10px] text-gray-400">{name.toLowerCase().replace(' ', '.')}@global-agri.com</p>
                </div>
            </div>
        </td>
        <td className="px-4 py-3">
            <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full border border-gray-200 uppercase">{role}</span>
        </td>
        <td className="px-4 py-3">
            <div className="flex items-center gap-1.5">
                <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Active' ? "bg-green-500" : "bg-gray-300")} />
                <span className="text-[10px] font-bold text-gray-600">{status}</span>
            </div>
        </td>
        <td className="px-4 py-3 text-right">
            <button className="p-1 text-gray-400 hover:text-gray-900"><MoreVertical className="w-4 h-4" /></button>
        </td>
    </tr>
)

const SecuritySettings = () => (
    <div className="erp-card p-6">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            Authentication & Guardrails
        </h3>
        <div className="space-y-1">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div>
                    <p className="text-xs font-bold text-gray-900">Multi-Factor Authentication</p>
                    <p className="text-[10px] text-gray-400">Add an extra layer of security to human interfaces.</p>
                </div>
                <div className="w-10 h-5 bg-primary-900 rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto shadow-sm" />
                </div>
            </div>
        </div>
    </div>
)

const SettingsTabButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all text-left",
            active ? "bg-white text-primary-900 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
        )}
    >
        <Icon className={cn("w-4 h-4", active ? "text-primary-600" : "text-gray-400")} />
        {label}
    </button>
)

export default SettingsModule
