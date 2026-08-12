'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5, // 5 นาที
          gcTime: 1000 * 60 * 30, // 30 นาที
          refetchOnWindowFocus: false, // ปิดการ re-fetch เมื่อสลับ tab
          retry: 1, // ลองใหม่เมื่อ error แค่ 1 ครั้ง
          refetchOnReconnect: false, // ไม่ต้อง re-fetch เมื่อเน็ตต่อใหม่
          refetchOnMount: false,
        },
      },
    })

    if (typeof window !== 'undefined') {
      window.__TANSTACK_QUERY_CLIENT__ = client
    }

    return client
  })

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
    </QueryClientProvider>
  )
}
