import {
    Bell,
    Search,
    Settings,
    HelpCircle,
    Building,
    ChevronDown
} from 'lucide-react'
import { useAuth } from '../../features/auth/AuthContext'

const Header = () => {
    const { user } = useAuth()

    return (
        <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6 flex-1">
                {/* Organization Information */}
                <div className="flex items-center gap-3 py-1.5 px-3 bg-gray-50 rounded-lg border border-gray-100 group cursor-pointer hover:bg-white hover:border-primary-200 transition-all">
                    <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center text-primary-600">
                        <Building className="w-4 h-4" />
                    </div>
                    <div className="hidden lg:block">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Active Organization</p>
                        <p className="text-xs font-bold text-gray-900 leading-none">Global Agriculture Corp Ltd.</p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                </div>

                {/* Global Search */}
                <div className="max-w-md w-full relative group">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search batches, transfers, or lineage tokens..."
                        className="w-full bg-gray-50 border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <HelpCircle className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all">
                    <Settings className="w-5 h-5" />
                </button>

                <div className="w-px h-6 bg-gray-200 mx-2" />

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-gray-900 leading-none mb-1">{user?.fullName}</p>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider leading-none">{user?.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white shadow-md ring-2 ring-primary-50 cursor-pointer">
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || '??'}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
