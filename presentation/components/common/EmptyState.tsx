import { PackageSearch } from 'lucide-react'
import React from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'ไม่พบข้อมูล',
  description = 'ไม่มีข้อมูลที่จะแสดงผลในขณะนี้',
  action,
}) => {
  return (
    <div className="flex min-h-75 w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-900/50">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        <PackageSearch className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
