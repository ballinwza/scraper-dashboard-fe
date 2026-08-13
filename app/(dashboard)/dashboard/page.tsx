'use client'

import MetricsCards from '@/presentation/components/dashboard/MetricsCards'

export default function DashboardPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <MetricsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border p-6 h-80 flex items-center justify-center text-slate-400 bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-500">
              [ Mock Price Trend Chart Area ]
            </div>
            <div className="rounded-xl border p-6 h-80 flex items-center justify-center text-slate-400 bg-white border-slate-200 dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-500">
              [ Mock Scraper Status Chart ]
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
