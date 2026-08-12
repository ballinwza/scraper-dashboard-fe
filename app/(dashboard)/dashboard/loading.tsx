import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Loading...
        </p>
      </div>
    </div>
  )
}
