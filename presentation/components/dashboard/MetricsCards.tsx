import { CheckCircle2, Clock, Database, Target } from 'lucide-react'

const metrics = [
  {
    title: 'Total Scraped Items',
    value: '12,480',
    change: '+12% from last week',
    icon: Database,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    title: 'Active Targets',
    value: '8 Sites',
    change: '2 Pending update',
    icon: Target,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    title: 'Success Rate',
    value: '98.5%',
    change: '-0.2% error rate',
    icon: CheckCircle2,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    title: 'Last Scraped Time',
    value: '10 mins ago',
    change: 'Job #1029 Finished',
    icon: Clock,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
  },
]

export default function MetricsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="p-5 rounded-xl shadow-sm transition-colors bg-white border border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-slate-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {item.title}
              </span>
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {item.value}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{item.change}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
