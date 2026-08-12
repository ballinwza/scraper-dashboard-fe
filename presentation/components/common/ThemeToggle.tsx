'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  isCollapsed: boolean
}

export default function ThemeToggle({ isCollapsed }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="cursor-pointer p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-teal-500 transition-all flex items-center justify-center min-w-9 min-h-9"
        aria-label="Toggle Dark Mode"
      />
    )
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="cursor-pointer p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:ring-2 ring-teal-500 transition-all flex items-center justify-center"
      aria-label="Toggle Dark Mode"
    >
      {resolvedTheme === 'light' ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}

      {!isCollapsed && <span className="ml-2 capitalize">{resolvedTheme}</span>}
    </button>
  )
}
