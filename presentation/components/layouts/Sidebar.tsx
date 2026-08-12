'use client'
import ThemeToggle from '@/presentation/components/common/ThemeToggle'
import {
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Globe,
  History,
  HouseHeart,
  LayoutDashboard,
  Settings,
  Terminal,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rental Estate', href: '/rental-estate', icon: HouseHeart },
  { name: 'Scraper Targets', href: '/targets', icon: Globe },
  { name: 'Jobs History', href: '/jobs', icon: History },
  { name: 'Real-time Logs', href: '/logs', icon: Terminal },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`relative flex flex-col border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800`}
    >
      <div className="flex h-16 items-center justify-between border-b px-4 border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
            <DatabaseZap className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg whitespace-nowrap transition-opacity duration-200 text-slate-900 dark:text-slate-100">
              Scraper
              <span className="text-teal-600 dark:text-teal-400">Hub</span>
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 p-3 overflow-x-hidden">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              title={isCollapsed ? item.name : undefined}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && (
                <span className="whitespace-nowrap transition-opacity duration-200">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3 border-slate-200 dark:border-slate-800 space-y-3">
        <div
          className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Appearance
            </span>
          )}
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center space-x-2 rounded-lg border py-2 transition-colors border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm font-medium">Collapse Menu</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
