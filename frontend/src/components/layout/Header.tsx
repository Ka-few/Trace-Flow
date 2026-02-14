import {
    Bell,
    Search,
    User as UserIcon,
    ChevronDown,
    Building2,
    Globe
} from 'lucide-react'

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
            <div className="flex items-center gap-8">
                {/* Organization Switcher */}
                <div className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-md transition-colors border border-transparent hover:border-gray-200">
                    <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center text-primary-700">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Organization</span>
                        <span className="text-sm font-semibold text-gray-900 leading-tight">Global Agriculture Corp</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-1 group-hover:text-primary-600 transition-colors" />
                </div>

                {/* Global Search Placeholder */}
                <div className="relative hidden lg:block">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search batches, assets, or compliance logs..."
                        className="bg-gray-50 border border-gray-200 rounded-md pl-10 pr-4 py-1.5 text-xs w-80 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Network status */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                    <Globe className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">Frankfurt DC</span>
                </div>

                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white" />
                </button>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 ml-2">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900 leading-none mb-0.5">Marcus Aurelius</p>
                        <p className="text-[11px] text-gray-500 font-medium">System Administrator</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary-800 text-white flex items-center justify-center shadow-sm cursor-pointer hover:bg-primary-900 transition-colors">
                        <UserIcon className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
