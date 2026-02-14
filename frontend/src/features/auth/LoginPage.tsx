import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Lock, Mail, Loader2, AlertCircle } from 'lucide-react'
import { useAuth } from './AuthContext'
import api from '../../api/client'

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const response = await api.post('/auth/login', { email, password })
            login(response.data.token, response.data.user)
            navigate('/dashboard')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.')

            // MOCK for development purposes if backend is not fully ready with seeding
            if (email === 'admin@traceflow.io') {
                login('mock-token', {
                    id: '1',
                    organizationId: 'org-1',
                    email: 'admin@traceflow.io',
                    fullName: 'TraceFlow Admin',
                    role: 'Admin',
                    isActive: true
                });
                navigate('/dashboard');
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 bg-primary-900 rounded-xl shadow-lg mb-4">
                        <Layers className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">TraceFlow</h1>
                    <p className="text-sm text-gray-500 font-medium mt-2 uppercase tracking-widest">Enterprise Operations Portal</p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-xs font-bold text-danger animate-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Corporate Email</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Access Secret</label>
                                <button type="button" className="text-[10px] font-bold text-primary-600 hover:underline">Forgot access?</button>
                            </div>
                            <div className="relative">
                                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary-900 hover:bg-black text-white font-bold py-3 rounded-lg shadow-lg shadow-primary-900/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Establish Connection
                                    <Lock className="w-4 h-4 text-primary-400 group-hover:text-white transition-colors" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-50 text-center">
                        <p className="text-[11px] text-gray-400 font-medium">
                            Authorized Personnel Only. System activity is logged and monitored.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-help hover:text-gray-600 transition-colors">Privacy Policy</p>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-help hover:text-gray-600 transition-colors">Compliance standards</p>
                    <div className="w-1 h-1 bg-gray-200 rounded-full" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest cursor-help hover:text-gray-600 transition-colors">Technical Support</p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
