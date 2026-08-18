'use client'

import { MessageRole } from '@/domain/entities/chat_session'
import { useChatSession } from '@/presentation/hooks/useChatSession'
import { useSearchSimilar } from '@/presentation/hooks/useRag'
import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Loader2,
  RefreshCw,
  Send,
  User,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export default function ChatSessionDetail() {
  const router = useRouter()
  const params = useParams()

  // ดึง sessionId จาก URL Parameter
  const sessionId = params?.id as string

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ดึง Hook สำหรับจัดการ Chat Session
  const { useGetSessionDetail, addMessage, isSendingMessage } = useChatSession()

  // ดึง Hook สำหรับค้นหาข้อมูล RAG
  const searchSimilarMutation = useSearchSimilar()

  // ดึงข้อมูลประวัติการสนทนา
  const {
    data: sessionData,
    isLoading: isSessionLoading,
    isError,
    error,
    refetch,
  } = useGetSessionDetail(sessionId)

  const isProcessing = isSendingMessage || searchSimilarMutation.isPending

  // เลื่อน Scrollbar ลงมาล่างสุดอัตโนมัติเมื่อมี Message ใหม่
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [sessionData?.session.messages, isProcessing])

  // ฟังก์ชันส่งข้อความ + เรียก RAG Search
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isProcessing || !sessionId) return

    const messageContent = input.trim()
    const chatbotId = sessionData?.session.chatbot_id || ''
    setInput('')

    try {
      // 1. บันทึกข้อความของผู้ใช้ (USER) เข้าสู่ Chat Session
      await addMessage({
        session_id: sessionId,
        role: MessageRole.USER,
        content: messageContent,
      })

      // 2. เรียกค้นหาคำตอบ RAG จาก SearchSimilar UseCase
      const ragResponse = await searchSimilarMutation.mutateAsync({
        chatbot_id: chatbotId,
        query_text: messageContent,
        top_k: 5,
      })

      // 3. บันทึกคำตอบจาก RAG (ASSISTANT) กลับเข้าสู่ Chat Session
      if (ragResponse?.answer_message) {
        await addMessage({
          session_id: sessionId,
          role: MessageRole.AI,
          content: ragResponse.answer_message,
        })
      }
    } catch (err) {
      console.error('Failed to process search message:', err)
    }
  }

  // ฟังก์ชันแปลงรูปแบบเวลา
  const formatTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push('/chat-sessions')}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            title="ย้อนกลับ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="p-2 bg-teal-500/10 dark:bg-cyan-500/10 rounded-lg text-teal-600 dark:text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-semibold text-sm md:text-base line-clamp-1">
              {sessionData?.session.session_title ||
                (isSessionLoading ? 'กำลังโหลด...' : 'ห้องสนทนา')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Session ID: {sessionId || '-'}
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="โหลดข้อมูลใหม่"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Message History Content Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {isSessionLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400 space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600 dark:text-cyan-400" />
            <span className="text-sm">กำลังโหลดประวัติการสนทนา...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center h-full text-rose-500 space-y-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm font-medium">
              เกิดข้อผิดพลาดในการโหลดข้อความ
            </p>
            <p className="text-xs text-slate-400">
              {(error as Error)?.message}
            </p>
          </div>
        ) : !sessionData?.session.messages ||
          sessionData.session.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <Bot className="w-10 h-10 opacity-30" />
            <p className="text-sm">เริ่มพิมพ์ข้อความด้านล่างเพื่อคุยกับ AI</p>
          </div>
        ) : (
          sessionData.session.messages.map((msg, index) => {
            const isUser = msg.role === 'USER' || msg.role === MessageRole.USER

            return (
              <div
                key={index}
                className={`flex items-start space-x-3 ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {isUser ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap wrap-break-words">
                    {msg.content}
                  </p>
                  <p
                    className={`text-[10px] mt-1 text-right ${
                      isUser ? 'text-teal-100' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            )
          })
        )}

        {/* Loading State เมื่อกำลังส่งข้อความ / ค้นหาคำตอบจาก RAG */}
        {isProcessing && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 flex items-center space-x-2 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-cyan-400" />
              <span>AI กำลังค้นหาข้อมูลและสรุปคำตอบ...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Footer */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="พิมพ์ข้อความที่นี่..."
          disabled={isSessionLoading || isProcessing}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isProcessing || isSessionLoading}
          className="p-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          {isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  )
}
