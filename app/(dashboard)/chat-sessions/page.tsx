'use client'

import { useChatSession } from '@/presentation/hooks/useChatSession'
import {
  Bot,
  ChevronRight,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ChatSessionList() {
  const router = useRouter()
  const { useListSessions, deleteSession, isDeletingSession } = useChatSession()

  // ดึงรายการ Chat Sessions ทั้งหมดผ่าน Hook useListSessions
  const { data, isLoading, isError, error, refetch } = useListSessions({
    page_size: 50,
  })

  // จัดการกดเพื่อไปหน้า Session Detail
  const handleSelectSession = (sessionId: string) => {
    router.push(`/chat-sessions/${sessionId}`)
  }

  // จัดการกดสร้าง Session ใหม่
  const handleCreateNewSession = () => {
    router.push('/chat-sessions/create')
  }

  // จัดการลบ Session ที่เลือก
  const handleDeleteSession = async (
    e: React.MouseEvent,
    sessionId: string
  ) => {
    e.stopPropagation() // ป้องกันไม่ให้ Trigger Event คลิก Card
    if (confirm('คุณต้องการลบห้องสนทนานี้ใช่หรือไม่?')) {
      try {
        await deleteSession({ id: sessionId })
      } catch (err) {
        console.error('Failed to delete session:', err)
      }
    }
  }

  // ฟังก์ชันช่วยแปลงรูปแบบวันที่
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 text-slate-900 dark:text-slate-100">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-7 h-7 text-teal-600 dark:text-cyan-400" />
              รายการประวัติการสนทนา
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              จัดการและเรียกดูประวัติการแชททั้งหมดของคุณ
            </p>
          </div>

          {/* ปุ่มสร้าง Session ใหม่ */}
          <button
            onClick={handleCreateNewSession}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-medium rounded-xl shadow-sm transition-colors duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>สร้างห้องแชทใหม่</span>
          </button>
        </div>

        {/* Content Section */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-cyan-400" />
            <p className="text-sm">กำลังโหลดรายการประวัติการสนทนา...</p>
          </div>
        ) : isError ? (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-sm flex justify-between items-center">
            <span>
              เกิดข้อผิดพลาดในการโหลดข้อมูล: {(error as Error)?.message}
            </span>
            <button
              onClick={() => refetch()}
              className="underline font-semibold hover:text-rose-800 dark:hover:text-rose-300"
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : !data?.sessions || data.sessions.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
              ยังไม่มีประวัติการสนทนา
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              คุณยังไม่ได้เริ่มการสนทนาใดๆ
              คลิกปุ่มด้านล่างเพื่อเริ่มสร้างห้องแชทใหม่ได้เลย
            </p>
            <button
              onClick={handleCreateNewSession}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>เริ่มการสนทนาใหม่</span>
            </button>
          </div>
        ) : (
          /* Chat Sessions Grid / List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-cyan-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Icon & Delete Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-cyan-400 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>

                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      disabled={isDeletingSession}
                      title="ลบห้องสนทนา"
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Chatbot ID */}
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1 mb-1">
                    {session.session_title || 'การสนทนาที่ไม่มีชื่อ'}
                  </h3>

                  <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-4">
                    <Bot className="w-3.5 h-3.5" />
                    <span className="truncate">
                      Bot ID: {session.chatbot_id}
                    </span>
                  </div>
                </div>

                {/* Footer Meta Details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {formatDate(session.updated_at || session.created_at)}
                    </span>
                  </div>

                  <span className="flex items-center text-teal-600 dark:text-cyan-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    เข้าสู่แชท <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
