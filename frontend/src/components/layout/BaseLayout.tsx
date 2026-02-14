import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const BaseLayout = () => {
    return (
        <div className="flex h-screen bg-[#f8fafc]">
            {/* Sidebar - Fixed width */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header - Fixed height */}
                <Header />

                {/* Content - Scrollable */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default BaseLayout
