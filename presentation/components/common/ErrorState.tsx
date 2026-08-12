import { AlertTriangle, RotateCcw } from 'lucide-react'
import React from 'react'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'เกิดข้อผิดพลาด',
  description = 'ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
  onRetry,
}) => {
  return (
    <div className="flex min-h-75 w-full flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-red-900 dark:text-red-200">
        {title}
      </h3>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-offset-gray-900"
        >
          <RotateCcw className="h-4 w-4" />
          ลองใหม่อีกครั้ง
        </button>
      )}
    </div>
  )
}
