import { Bell, Search, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="h-16 backdrop-blur-md border-b px-6 flex items-center justify-between sticky top-0 z-10 bg-white/80 border-slate-200 dark:bg-slate-900/80 dark:border-slate-800">
      <div className="flex items-center space-x-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Overview Dashboard
        </h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-1.5 animate-pulse" />
          System Active
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search properties, targets..."
            className="w-64 text-sm px-9 py-1.5 rounded-lg border transition-colors outline-none bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-200 dark:focus:border-cyan-500 dark:placeholder:text-slate-500"
          />
        </div>

        <button className="p-2 rounded-lg transition-colors relative text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-cyan-400 absolute top-2 right-2" />
        </button>

        <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full flex items-center justify-center border bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
            <User className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-medium text-slate-900 dark:text-slate-200">
              Admin User
            </p>
            <p className="text-slate-500">System Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
