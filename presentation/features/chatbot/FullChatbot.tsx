'use client'

import { useChatbot } from '@/presentation/hooks/useChatbot'
import {
  Bot,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  Plus,
  Send,
  Trash2,
  User,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

// โครงสร้างไฟล์แนบ
export interface AttachedFile {
  id: string
  name: string
  type: 'image' | 'pdf'
  url: string
  fileObj?: File
}

// โครงสร้างข้อความ
export interface Message {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
}

// โครงสร้างห้องแชท
export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  files: AttachedFile[]
}

export default function ChatbotClient() {
  const { chatbotanswer, isAnswerLoading } = useChatbot()

  // State สำหรับจัดการหลายห้องแชท
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'default-1',
      title: 'สนทนาใหม่ 1',
      messages: [
        {
          id: '1',
          sender: 'bot',
          text: 'สวัสดีครับ มีอะไรให้ผมช่วยเหลือวันนี้ครับ?',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
      files: [],
    },
  ])

  const [activeSessionId, setActiveSessionId] = useState<string>('default-1')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)

  // State สำหรับ ซ่อน / แสดง ช่องไฟล์แนบใน Sidebar
  const [isFileSectionOpen, setIsFileSectionOpen] = useState<boolean>(true)

  // Input state สำหรับข้อความปัจจุบัน
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ดึงห้องแชทปัจจุบัน
  const currentSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages, isAnswerLoading, isLoading])

  // สร้างห้องแชทใหม่
  const handleCreateNewChat = () => {
    const newId = Date.now().toString()
    const newSession: ChatSession = {
      id: newId,
      title: `สนทนาใหม่ ${sessions.length + 1}`,
      messages: [
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: 'สวัสดีครับ มีอะไรให้ผมช่วยเหลือวันนี้ครับ?',
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ],
      files: [],
    }
    setSessions((prev) => [...prev, newSession])
    setActiveSessionId(newId)
  }

  // ลบห้องแชท
  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (sessions.length === 1) return

    const updatedSessions = sessions.filter((s) => s.id !== id)
    setSessions(updatedSessions)

    if (activeSessionId === id) {
      setActiveSessionId(updatedSessions[0].id)
    }
  }

  // จัดการการเลือกไฟล์ PDF/รูปภาพ
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newAttachedFiles: AttachedFile[] = Array.from(files).map((file) => {
      const isImage = file.type.startsWith('image/')
      return {
        id: Date.now() + Math.random().toString(),
        name: file.name,
        type: isImage ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        fileObj: file,
      }
    })

    // อัปเดตรายการไฟล์ในแชทปัจจุบัน และเปิดช่องแสดงไฟล์อัตโนมัติเมื่อแนบไฟล์เพิ่ม
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            files: [...session.files, ...newAttachedFiles],
          }
        }
        return session
      })
    )
    setIsFileSectionOpen(true)

    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ลบไฟล์ออกจาก Sidebar
  const handleRemoveFileFromSidebar = (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation()
    e.preventDefault()
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          return {
            ...session,
            files: session.files.filter((f) => f.id !== fileId),
          }
        }
        return session
      })
    )
  }

  // ส่งข้อความ
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isAnswerLoading) return

    const userMessageText = input.trim()

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userMessageText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === activeSessionId) {
          const isFirstUserMsg = !session.messages.some(
            (m) => m.sender === 'user'
          )
          return {
            ...session,
            title:
              isFirstUserMsg && userMessageText
                ? userMessageText.slice(0, 20) + '...'
                : session.title,
            messages: [...session.messages, userMessage],
          }
        }
        return session
      })
    )

    setInput('')
    setIsLoading(true)

    try {
      const answer = await chatbotanswer(userMessageText)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: answer?.answer || 'ขออภัย ไม่สามารถประมวลผลคำตอบได้ในขณะนี้',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, botMessage],
            }
          }
          return session
        })
      )
    } catch {
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Sidebar ทางซ้าย */}
      <div
        className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-16' : 'w-64 md:w-72'
        }`}
      >
        {/* ปุ่ม Toggle ยืด/หด Sidebar */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-4 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 shadow-md"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <span className="font-semibold text-sm">ประวัติการสนทนา</span>
          )}
        </div>

        {/* รายการห้องแชท (Chat Sessions) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => setActiveSessionId(session.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
                session.id === activeSessionId
                  ? 'bg-teal-50 dark:bg-cyan-950/40 text-teal-600 dark:text-cyan-400 font-medium'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center space-x-2 min-w-0">
                <Bot className="w-4 h-4 shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="truncate text-xs">{session.title}</span>
                )}
              </div>
              {!isSidebarCollapsed && sessions.length > 1 && (
                <button
                  onClick={(e) => handleDeleteChat(e, session.id)}
                  className="p-1 hover:text-red-500 rounded transition-colors opacity-0 hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* รายการไฟล์ในแชทนี้ (ส่วนที่เพิ่มปุ่มซ่อน/แสดง) */}
        {!isSidebarCollapsed && (
          <div className="border-t border-slate-200 dark:border-slate-800">
            {/* Header / ปุ่มสำหรับกด ซ่อน-แสดง */}
            <button
              type="button"
              onClick={() => setIsFileSectionOpen(!isFileSectionOpen)}
              className="w-full px-3 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span className="uppercase tracking-wider">
                ไฟล์ในแชทนี้ ({currentSession.files.length})
              </span>
              {isFileSectionOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {/* เนื้อหารายการไฟล์แนบ */}
            {isFileSectionOpen && (
              <div className="px-3 pb-3 max-h-40 overflow-y-auto">
                {currentSession.files.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    ยังไม่มีไฟล์แนบ
                  </p>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    {currentSession.files.map((file) => (
                      <div
                        key={file.id}
                        className="group flex items-center justify-between p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-2 text-xs truncate flex-1 min-w-0"
                        >
                          {file.type === 'image' ? (
                            <ImageIcon className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          )}
                          <span className="truncate">{file.name}</span>
                        </a>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleRemoveFileFromSidebar(e, file.id)
                          }
                          className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ปุ่มสร้างห้องใหม่ ด้านล่างสุด */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleCreateNewChat}
            className={`w-full flex items-center justify-center space-x-2 py-2 px-3 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-xs font-medium rounded-lg transition-colors ${
              isSidebarCollapsed ? 'px-0' : ''
            }`}
          >
            <Plus className="w-4 h-4" />
            {!isSidebarCollapsed && <span>สร้างแชทใหม่</span>}
          </button>
        </div>
      </div>

      {/* พื้นที่หลัก Chat Content */}
      <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900">
        {/* Chat Header */}
        <div className="flex items-center space-x-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="p-2 bg-teal-500/10 dark:bg-cyan-500/10 rounded-lg text-teal-600 dark:text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-semibold text-sm md:text-base">
              {currentSession.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {currentSession.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-cyan-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Form ช่องพิมพ์และปุ่มแนบไฟล์ */}
        <form
          onSubmit={handleSend}
          className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex space-x-2"
        >
          {/* Hidden Input สำหรับ File Upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            multiple
            className="hidden"
          />

          {/* ปุ่มคลิปหนีบกระดาษ */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="พิมพ์ข้อความที่นี่..."
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
