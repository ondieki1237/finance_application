"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authApi } from "@/lib/api-client"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, User, Mail, Lock, Phone, ArrowRight, Plus, X, Wallet } from "lucide-react"

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })
    const [incomeSources, setIncomeSources] = useState<string[]>([""])
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem("jwt")
        if (token) {
            router.push("/dashboard")
        }
    }, [router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleIncomeSourceChange = (index: number, value: string) => {
        const newSources = [...incomeSources]
        newSources[index] = value
        setIncomeSources(newSources)
    }

    const addIncomeSource = () => {
        setIncomeSources([...incomeSources, ""])
    }

    const removeIncomeSource = (index: number) => {
        const newSources = incomeSources.filter((_, i) => i !== index)
        setIncomeSources(newSources)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        const validIncomeSources = incomeSources.filter(source => source.trim() !== "")
        if (validIncomeSources.length === 0) {
            setError("Please add at least one income source")
            return
        }

        setLoading(true)
        try {
            const { confirmPassword, ...registerData } = formData
            const result = await authApi.register({
                ...registerData,
                incomeSources: validIncomeSources
            })
            localStorage.setItem("jwt", result.token)
            router.push("/dashboard")
        } catch (err: any) {
            setError(err.message || "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md my-8"
            >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-gray-300">Join us and start your journey</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300 ml-1">Income Sources</label>
                                    {incomeSources.map((source, index) => (
                                        <div key={index} className="relative flex gap-2">
                                            <div className="relative flex-1">
                                                <Wallet className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Salary, Freelance"
                                                    value={source}
                                                    onChange={(e) => handleIncomeSourceChange(index, e.target.value)}
                                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                                    required={index === 0}
                                                />
                                            </div>
                                            {incomeSources.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeIncomeSource(index)}
                                                    className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addIncomeSource}
                                        className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 ml-1 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" /> Add another source
                                    </button>
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-black/20 p-4 text-center">
                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
