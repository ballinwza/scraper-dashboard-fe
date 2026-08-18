'use client'
import ThemeToggle from '@/presentation/components/common/ThemeToggle'
import { useAuthStore } from '@/presentation/stores/authStore'
import {
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DatabaseZap,
  Globe,
  HouseHeart,
  LayoutDashboard,
  Lock,
  LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface NavItem {
  name: string
  href?: string
  icon: LucideIcon
  badge?: string
  roles?: string[]
  children?: {
    name: string
    href: string
    badge?: string
    roles?: string[]
  }[]
}

// 1. เพิ่ม property badge ให้กับ menu item
const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rental Estate', href: '/rental-estate', icon: HouseHeart },
  {
    name: 'AI Assistant',
    // href: '/chatbot',
    icon: Bot,
    children: [
      { name: 'Tutorial', href: '/tutorial' },
      { name: 'Chatbot', href: '/chat-sessions' },
      { name: 'AI Agent', href: '/chatbot' },
    ],
  },
  {
    name: 'Scraper',
    href: '/scraper',
    icon: Globe,
    badge: 'Admin Only',
    roles: ['admin'],
  },
  // { name: 'Jobs History', href: '/jobs', icon: History },
  // { name: 'Real-time Logs', href: '/logs', icon: Terminal },
  // { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
}
export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  // State สำหรับเก็บเมนูที่กำลังเปิด Submenu อยู่
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleSubmenu = (name: string) => {
    // ถ้า Sidebar พับอยู่ แล้วคลิกเมนูที่มี Submenu ให้ขยาย Sidebar ออกมาก่อน
    if (isCollapsed) {
      setIsCollapsed(false)
    }
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

  return (
    <aside
      className={`relative flex flex-col border-r transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800`}
    >
      {/* Header */}
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

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 p-3 overflow-x-hidden overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isAllowed =
            !item.roles || (user?.role && item.roles.includes(user.role))

          // กรณี: ไม่มีสิทธิ์เข้าถึง (Restricted Role)
          if (!isAllowed) {
            return (
              <div
                key={item.name}
                title={
                  isCollapsed
                    ? `${item.name} (Restricted)`
                    : 'Admin Access Only'
                }
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-600 select-none"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap transition-opacity duration-200">
                      {item.name}
                    </span>
                  )}
                </div>
                {!isCollapsed && (
                  <Lock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 shrink-0 ml-2" />
                )}
              </div>
            )
          }

          // กรณี: มี Submenu (Nested Menu)
          if (item.children && item.children.length > 0) {
            const isSubmenuActive = item.children.some(
              (child) => pathname === child.href
            )
            const isOpen = openMenus[item.name] ?? isSubmenuActive

            return (
              <div key={item.name} className="space-y-1">
                {/* Main Parent Button */}
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.name)}
                  title={
                    isCollapsed
                      ? item.badge
                        ? `${item.name} (${item.badge})`
                        : item.name
                      : undefined
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isSubmenuActive
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <Icon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap transition-opacity duration-200">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                      {item.badge && (
                        <span className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  )}
                </button>

                {/* Submenu Items List */}
                {!isCollapsed && isOpen && (
                  <div className="ml-4 pl-3 border-l border-slate-200 dark:border-slate-800 space-y-1 my-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href
                      const isChildAllowed =
                        !child.roles ||
                        (user?.role && child.roles.includes(user.role))

                      if (!isChildAllowed) return null

                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                            isChildActive
                              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-semibold'
                              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
                          }`}
                        >
                          <span className="whitespace-nowrap">
                            {child.name}
                          </span>
                          {child.badge && (
                            <span className="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] text-amber-600 dark:text-amber-400">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // กรณี: เมนูปกติ (ไม่มี Submenu)
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href || '#'}
              title={
                isCollapsed
                  ? item.badge
                    ? `${item.name} (${item.badge})`
                    : item.name
                  : undefined
              }
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <Icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap transition-opacity duration-200">
                    {item.name}
                  </span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className="ml-2 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Controls */}
      <div className="border-t p-3 border-slate-200 dark:border-slate-800 space-y-3">
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center' : 'justify-between px-2'
          }`}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Appearance
            </span>
          )}
          <ThemeToggle isCollapsed={isCollapsed} />
        </div>

        <button
          type="button"
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
