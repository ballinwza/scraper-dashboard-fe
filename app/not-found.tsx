import { FileQuestion, Home } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 text-center dark:bg-gray-950">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <FileQuestion className="h-10 w-10 text-gray-600 dark:text-gray-400" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        404 - ไม่พบหน้าเว็บ
      </h1>
      <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
        ขออภัย ไม่พบหน้าที่คุณกำลังค้นหา หรือหน้านี้อาจถูกย้ายไปแล้ว
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
      >
        <Home className="h-4 w-4" />
        กลับหน้าหลัก
      </Link>
    </div>
  )
}
