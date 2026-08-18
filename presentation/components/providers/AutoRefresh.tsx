'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useTransition } from 'react'

export default function AutoRefresh({
  intervalMinutes = 10,
}: {
  intervalMinutes?: number
}) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const lastRefreshedRef = useRef<number>(Date.now())

  useEffect(() => {
    const intervalMs = intervalMinutes * 60 * 1000

    const triggerRefresh = () => {
      // console.log(
      //   `[AutoRefresh] Refreshing at ${new Date().toLocaleTimeString()}...`
      // )
      lastRefreshedRef.current = Date.now()
      startTransition(() => {
        router.refresh()
      })
    }

    // 1. ตั้ง Interval ตามปกติ
    const timer = setInterval(() => {
      // เช็คว่าถ้าหน้าจอเปิดอยู่ ค่อย Refresh
      if (document.visibilityState === 'visible') {
        triggerRefresh()
      }
    }, intervalMs)

    // 2. จับเหตุการณ์เมื่อผู้ใช้ "สลับจอกลับมา" (Visibility Change)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const timePassed = Date.now() - lastRefreshedRef.current

        // ถ้าซ่อนอยู่นานเกิน 10 นาทีแล้ว พอกลับมามองเห็น ให้ Refresh ทันที
        if (timePassed >= intervalMs) {
          // console.log(
          //   '[AutoRefresh] Tab became visible after interval passed. Refreshing now!'
          // )
          triggerRefresh()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router, intervalMinutes])

  return null
}
