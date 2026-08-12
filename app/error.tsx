'use client'

import { AlertCircle, RotateCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center dark:bg-gray-950">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
        <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        เกิดข้อผิดพลาดในระบบ
      </h1>
      <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
        {error.message || 'เกิดปัญหาบางอย่างขึ้น กรุณาลองใหม่อีกครั้งในภายหลัง'}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600 dark:focus:ring-red-900"
      >
        <RotateCcw className="h-4 w-4" />
        ลองใหม่อีกครั้ง
      </button>
    </div>
  )
}
