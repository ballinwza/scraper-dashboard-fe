'use client'

import { useAuth } from '@/presentation/hooks/useAuth'
import { Loader2, Lock, Mail, User, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'

export default function RegisterClient() {
  const { register, isLoading, error } = useAuth()

  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  // State for form field errors
  const [formErrors, setFormErrors] = useState<{
    name?: string
    username?: string
    password?: string
    confirmPassword?: string
  }>({})

  // Handle input changes
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error message when user starts typing
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  // Form validation logic
  const validateForm = () => {
    const errors: typeof formErrors = {}

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Display name must be at least 2 characters long'
    }

    if (!formData.username.trim() || formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters long'
    }

    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    register({
      name: formData.name,
      username: formData.username,
      password: formData.password,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md space-y-8 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-cyan-500/10 text-cyan-400 mb-3">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">
            Create an Account
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Enter your details below to create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {formErrors.name && (
              <p className="text-xs text-red-400 mt-1">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="johndoe"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {formErrors.username && (
              <p className="text-xs text-red-400 mt-1">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {formErrors.password && (
              <p className="text-xs text-red-400 mt-1">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange('confirmPassword', e.target.value)
                }
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-lg text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-500"
              />
            </div>
            {formErrors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {formErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-sm transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account ?{' '}
          <Link href="/" className="text-cyan-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
