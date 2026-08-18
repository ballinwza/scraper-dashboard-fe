// 'use client'

// import { useChatbot } from '@/presentation/hooks/useChatbot'
// import {
//   Bot,
//   Loader2,
//   MessageSquare,
//   Plus,
//   Send,
//   Trash2,
//   User,
// } from 'lucide-react'
// import React, { useEffect, useRef, useState } from 'react'

// interface Message {
//   id: string
//   sender: 'user' | 'bot'
//   text: string
//   timestamp: string
// }

// interface ChatSession {
//   id: string
//   title: string
//   messages: Message[]
// }

// const INITIAL_BOT_MESSAGE: Message = {
//   id: '1',
//   sender: 'bot',
//   text: 'สวัสดีครับ มีอะไรให้ผมช่วยเหลือวันนี้ครับ?',
//   timestamp: new Date().toLocaleTimeString([], {
//     hour: '2-digit',
//     minute: '2-digit',
//   }),
// }

// export default function MultiChatbotClient() {
//   const { chatbotanswer, isAnswerLoading } = useChatbot()

//   // จัดการ Multi Chat Sessions
//   const [sessions, setSessions] = useState<ChatSession[]>([
//     {
//       id: 'default-1',
//       title: 'บทสนทนาใหม่',
//       messages: [INITIAL_BOT_MESSAGE],
//     },
//   ])
//   const [activeSessionId, setActiveSessionId] = useState<string>('default-1')

//   const [input, setInput] = useState('')
//   const [isLoading, setIsLoading] = useState(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)

//   // ดึง Session ปัจจุบันที่กำลังใช้งานอยู่
//   const activeSession =
//     sessions.find((s) => s.id === activeSessionId) || sessions[0]

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [activeSession?.messages, isAnswerLoading, isLoading])

//   // ฟังก์ชันสร้างห้องแชทใหม่
//   const handleCreateNewChat = () => {
//     const newSessionId = Date.now().toString()
//     const newSession: ChatSession = {
//       id: newSessionId,
//       title: `บทสนทนาใหม่`,
//       messages: [
//         {
//           ...INITIAL_BOT_MESSAGE,
//           timestamp: new Date().toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           }),
//         },
//       ],
//     }
//     setSessions((prev) => [newSession, ...prev])
//     setActiveSessionId(newSessionId)
//   }

//   // ฟังก์ชันลบห้องแชท
//   const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
//     e.stopPropagation()
//     if (sessions.length === 1) return // ป้องกันการลบห้องสุดท้ายออกทั้งหมด

//     const updatedSessions = sessions.filter((s) => s.id !== sessionId)
//     setSessions(updatedSessions)

//     if (activeSessionId === sessionId) {
//       setActiveSessionId(updatedSessions[0].id)
//     }
//   }

//   // ฟังก์ชันส่งข้อความ
//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!input.trim() || isAnswerLoading || isLoading) return

//     const userText = input.trim()
//     const currentTime = new Date().toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     })

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       sender: 'user',
//       text: userText,
//       timestamp: currentTime,
//     }

//     // 1. เพิ่มข้อความของ User ใน Session ปัจจุบัน
//     setSessions((prev) =>
//       prev.map((session) => {
//         if (session.id === activeSessionId) {
//           // หากเป็นข้อความแรก ตั้งชื่อห้องตามข้อความผู้ใช้
//           const isFirstUserMessage = session.messages.length <= 1
//           const updatedTitle = isFirstUserMessage
//             ? userText.slice(0, 20) + (userText.length > 20 ? '...' : '')
//             : session.title

//           return {
//             ...session,
//             title: updatedTitle,
//             messages: [...session.messages, userMessage],
//           }
//         }
//         return session
//       })
//     )

//     setInput('')
//     setIsLoading(true)

//     try {
//       // 2. เรียก API คำตอบ chatbot
//       const answer = await chatbotanswer(userText)

//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         sender: 'bot',
//         text: answer?.answer || 'ขออภัย ไม่สามารถดึงข้อมูลได้ในขณะนี้',
//         timestamp: new Date().toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//       }

//       // 3. เพิ่มข้อความ Bot ใน Session ปัจจุบัน
//       setSessions((prev) =>
//         prev.map((session) =>
//           session.id === activeSessionId
//             ? { ...session, messages: [...session.messages, botMessage] }
//             : session
//         )
//       )
//     } catch {
//       // Handle error
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="flex h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
//       {/* Sidebar สำหรับจัดการ Multi Chat */}
//       <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col shrink-0">
//         <div className="p-4 border-b border-slate-200 dark:border-slate-800">
//           <button
//             onClick={handleCreateNewChat}
//             className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-colors"
//           >
//             <Plus className="w-4 h-4" />
//             <span>สร้างแชทใหม่</span>
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto p-2 space-y-1">
//           {sessions.map((session) => {
//             const isActive = session.id === activeSessionId
//             return (
//               <div
//                 key={session.id}
//                 onClick={() => setActiveSessionId(session.id)}
//                 className={`group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer transition-colors ${
//                   isActive
//                     ? 'bg-teal-50 dark:bg-cyan-950/30 text-teal-600 dark:text-cyan-400 font-medium'
//                     : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
//                 }`}
//               >
//                 <div className="flex items-center space-x-2.5 min-w-0 pr-2">
//                   <MessageSquare className="w-4 h-4 shrink-0" />
//                   <span className="truncate">{session.title}</span>
//                 </div>
//                 {sessions.length > 1 && (
//                   <button
//                     onClick={(e) => handleDeleteChat(e, session.id)}
//                     className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 rounded transition-opacity"
//                     title="ลบบทสนทนา"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 )}
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <div className="flex items-center space-x-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
//           <div className="p-2 bg-teal-500/10 dark:bg-cyan-500/10 rounded-lg text-teal-600 dark:text-cyan-400">
//             <Bot className="w-6 h-6" />
//           </div>
//           <div>
//             <h2 className="font-semibold text-sm md:text-base">AI Assistant</h2>
//             <p className="text-xs text-slate-500 dark:text-slate-400">
//               {activeSession.title}
//             </p>
//           </div>
//         </div>

//         {/* Messages List */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
//           {activeSession.messages.map((msg) => (
//             <div
//               key={msg.id}
//               className={`flex items-start space-x-3 ${
//                 msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
//                   msg.sender === 'user'
//                     ? 'bg-teal-600 text-white'
//                     : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
//                 }`}
//               >
//                 {msg.sender === 'user' ? (
//                   <User className="w-4 h-4" />
//                 ) : (
//                   <Bot className="w-4 h-4" />
//                 )}
//               </div>

//               <div
//                 className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
//                   msg.sender === 'user'
//                     ? 'bg-teal-600 text-white rounded-tr-none'
//                     : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap break-words">{msg.text}</p>
//                 <p
//                   className={`text-[10px] mt-1 text-right ${
//                     msg.sender === 'user' ? 'text-teal-100' : 'text-slate-400'
//                   }`}
//                 >
//                   {msg.timestamp}
//                 </p>
//               </div>
//             </div>
//           ))}

//           {(isLoading || isAnswerLoading) && (
//             <div className="flex items-start space-x-3">
//               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
//                 <Bot className="w-4 h-4" />
//               </div>
//               <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3">
//                 <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-cyan-400" />
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Form */}
//         <form
//           onSubmit={handleSend}
//           className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex items-center space-x-2"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="พิมพ์ข้อความที่นี่..."
//             className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500 dark:focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
//           />
//           <button
//             type="submit"
//             disabled={!input.trim() || isAnswerLoading || isLoading}
//             className="p-2.5 bg-teal-600 hover:bg-teal-700 dark:bg-cyan-600 dark:hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg transition-colors"
//           >
//             <Send className="w-4 h-4" />
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
