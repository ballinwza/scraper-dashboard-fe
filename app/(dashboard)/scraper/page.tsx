'use client'
import ScrapeFormClient from '@/presentation/clients/ScraperClient'
import { useAuthStore } from '@/presentation/stores/authStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ScrapeTargetsPage() {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user?.role !== 'admin') {
      router.replace('/dashboard')
    }
  }, [user, isAuthenticated, router])

  if (user?.role !== 'admin') {
    return null
  }

  return <ScrapeFormClient />
}
