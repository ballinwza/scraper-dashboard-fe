'use client'

import { ChatbotBlueprintResDTO } from '@/application/dto/chatbot.dto'
import {
  useChatbotList,
  useDeleteChatbot,
} from '@/presentation/hooks/useChatbot'
import {
  AlertCircle,
  Bot,
  Calendar,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ChatbotListPage() {
  const router = useRouter()

  // 1. เรียกใช้ Hook ดึงรายการ Chatbots ทั้งหมด
  const { data, isLoading, isError, error, refetch } = useChatbotList({
    page_size: 20,
    page_token: 0,
  })

  // 2. Hook สำหรับลบ Chatbot
  const deleteMutation = useDeleteChatbot()

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // ป้องกันการ trigger การกดเปิดดูรายละเอียด
    if (confirm('คุณต้องการลบ Chatbot นี้ใช่หรือไม่?')) {
      deleteMutation.mutate({ id })
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-7 h-7 text-teal-600 dark:text-cyan-400" />
            รายการ Chatbots ของฉัน
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            จัดการและเรียกดู AI Chatbot Blueprint ทั้งหมดที่คุณสร้างไว้
          </p>
        </div>

        <button
          onClick={() => router.push('/chatbot/create')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          สร้าง Chatbot ใหม่
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-cyan-400" />
          <p>กำลังโหลดข้อมูล Chatbots...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg flex items-center justify-between text-red-700 dark:text-red-400">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>
              เกิดข้อผิดพลาดในการโหลดข้อมูล:{' '}
              {(error as Error)?.message || 'โปรดลองใหม่อีกครั้ง'}
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="px-3 py-1 bg-red-100 dark:bg-red-900/50 hover:bg-red-200 rounded text-sm font-medium"
          >
            ลองใหม่
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && data?.chatbots.length === 0 && (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-800 rounded-xl space-y-4">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">
              ยังไม่มี Chatbot
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              เริ่มต้นสร้าง Chatbot Blueprint แรกของคุณได้เลย
            </p>
          </div>
          <button
            onClick={() => router.push('/chatbot/create')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            สร้าง Chatbot ใหม่
          </button>
        </div>
      )}

      {/* Chatbot Cards Grid */}
      {!isLoading && !isError && data?.chatbots && data.chatbots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.chatbots.map((bot: ChatbotBlueprintResDTO) => (
            <div
              key={bot.id}
              onClick={() => router.push(`/chatbot/${bot.id}`)}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500/50 dark:hover:border-cyan-500/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 bg-teal-50 dark:bg-cyan-950/50 rounded-lg text-teal-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6" />
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, bot.id)}
                    disabled={deleteMutation.isPending}
                    title="ลบ Chatbot"
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {bot.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {bot.description || 'ไม่มีรายละเอียดอธิบายเพิ่มเติม'}
                  </p>
                </div>

                {/* System Prompt Preview */}
                <div className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-mono line-clamp-2">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      Prompt:{' '}
                    </span>
                    {bot.system_prompt}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(bot.created_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>

                <span className="flex items-center gap-1 text-teal-600 dark:text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform">
                  จัดการบอท
                  <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
