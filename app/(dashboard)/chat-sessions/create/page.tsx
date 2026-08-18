'use client'

import { useChatSession } from '@/presentation/hooks/useChatSession'
import { useChatbotList } from '@/presentation/hooks/useChatbot'
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  FileText,
  Loader2,
  MessageSquare,
  PlusCircle,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function CreateChatSessionPage() {
  const router = useRouter()

  // 1. เรียกใช้ Hook สำหรับ Chat Session
  const { createSession, isCreatingSession } = useChatSession()

  // 2. เรียกใช้ Hook สำหรับดึงรายการ Chatbot ทั้งหมดมาเลือก
  const { data: chatbotData, isLoading: isChatbotsLoading } = useChatbotList({
    page_size: 50,
  })

  // 3. Local States สำหรับ Form
  const [selectedChatbotId, setSelectedChatbotId] = useState('')
  const [sessionTitle, setSessionTitle] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 4. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!selectedChatbotId) {
      setErrorMessage('กรุณาเลือก Chatbot ก่อนทำการสร้างห้องแชท')
      return
    }

    try {
      const res = await createSession({
        chatbot_id: selectedChatbotId,
        session_title: sessionTitle.trim() || undefined,
      })

      // เมื่อสร้างสำเร็จ นำทางไปยังหน้า Detail ของ Chat Session นั้น
      if (res?.session?.id) {
        router.push(`/chat-sessions/${res.session.id}`)
      } else {
        router.push('/chat-sessions')
      }
    } catch (err) {
      setErrorMessage(
        (err as Error)?.message || 'เกิดข้อผิดพลาดในการสร้างห้องแชท'
      )
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Back Button */}
      <button
        onClick={() => router.push('/chat-sessions')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้ารายการประวัติการสนทนา
      </button>

      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-teal-600 dark:text-cyan-400" />
          สร้างห้องสนทนาใหม่
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          เลือก Chatbot และตั้งชื่อหัวข้อสนทนาเพื่อเริ่มการพูดคุย
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-400 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Form Section */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6"
      >
        {/* Field 1: เลือก Chatbot */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            เลือก Chatbot <span className="text-rose-500">*</span>
          </label>

          {isChatbotsLoading ? (
            <div className="flex items-center space-x-2 text-sm text-slate-400 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-cyan-400" />
              <span>กำลังโหลดรายการ Chatbot...</span>
            </div>
          ) : (
            <select
              value={selectedChatbotId}
              onChange={(e) => setSelectedChatbotId(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-500 transition-all text-slate-900 dark:text-slate-100"
            >
              <option value="" disabled>
                -- กรุณาเลือก Chatbot --
              </option>
              {chatbotData?.chatbots?.map((bot) => (
                <option key={bot.id} value={bot.id}>
                  {bot.name} {bot.description ? `(${bot.description})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Field 2: หัวข้อการสนทนา (Session Title) */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400" />
            หัวข้อการสนทนา (Session Title)
          </label>
          <p className="text-xs text-slate-400">
            ระบุหัวข้อสั้นๆ หรือเว้นว่างไว้เพื่อใช้อย่างไม่เป็นทางการ
          </p>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="เช่น สอบถามรายละเอียดโปรโมชั่น, ปรึกษาปัญหาสินค้า"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-cyan-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => router.push('/chat-sessions')}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isCreatingSession || !selectedChatbotId}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 shadow-sm"
          >
            {isCreatingSession ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังสร้าง...
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                สร้างห้องสนทนา
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
