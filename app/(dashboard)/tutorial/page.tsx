'use client'

import { useCreateChatbot } from '@/presentation/hooks/useChatbot'
import { useChatSession } from '@/presentation/hooks/useChatSession'
import { useUploadKnowledgeFile } from '@/presentation/hooks/useKnowledgeFile'
import { DEFAULT_PROMPT } from '@/shared/utils/prompt'
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileText,
  FolderUp,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  MessageSquarePlus,
  Sparkles,
  UploadCloud,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

// นำเข้า Hooks ที่ต้องใช้งาน

export default function ChatbotGuidePage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState<number>(1)

  // Hooks Mutation
  const createChatbotMutation = useCreateChatbot()
  const uploadKnowledgeMutation = useUploadKnowledgeFile()
  const { createSession: createSessionMutation, isCreatingSession } =
    useChatSession()

  // Step 1 State: Form สร้าง Agent
  const [agentName, setAgentName] = useState('')
  const [agentPrompt, setAgentPrompt] = useState(DEFAULT_PROMPT)
  const [createdAgentId, setCreatedAgentId] = useState<string | null>(null)

  // Step 2 State: Mock Upload File
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploaded, setIsUploaded] = useState(false)

  // Step 3 State: Form สร้าง Chat Session
  const [sessionTitle, setSessionTitle] = useState('')

  // Handler ขั้นตอนที่ 1: สร้าง Agent ผ่าน API
  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentName.trim()) return

    createChatbotMutation.mutate(
      {
        name: agentName.trim(),
        system_prompt: agentPrompt,
      },
      {
        onSuccess: (data) => {
          // ดึง id จาก response (ปรับเปลี่ยน field ตาม Response DTO จริง เช่น data.id หรือ data.botId)
          const botId =
            data?.chatbot || `bot-${Date.now().toString().slice(-4)}`
          setCreatedAgentId(botId.id)
          setActiveStep(2)
        },
      }
    )
  }

  // Handler ขั้นตอนที่ 2: อัปโหลดไฟล์ความรู้ผ่าน API (PDF, JPG, PNG)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
    }
  }

  const handleUploadKnowledge = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !createdAgentId) return

    uploadKnowledgeMutation.mutate(
      {
        file: selectedFile,
        chatbot_id: createdAgentId,
      },
      {
        onSuccess: () => {
          setIsUploaded(true)
          setTimeout(() => {
            setActiveStep(3)
          }, 800)
        },
      }
    )
  }

  // Handler ขั้นตอนที่ 3: สร้าง Chat Session ผ่าน API และนำทางไปยังหน้าแชต
  const handleStartChatSession = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sessionTitle.trim() || !createdAgentId) return

    createSessionMutation(
      {
        session_title: sessionTitle.trim(),
        chatbot_id: createdAgentId,
      },
      {
        onSuccess: (data: any) => {
          // ดึง sessionId จาก response
          router.push(`/chat-sessions`)
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-500/10 dark:bg-cyan-500/10 text-teal-600 dark:text-cyan-400 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            เริ่มต้นใช้งาน AI Chatbot แบบStep-by-Step
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            สร้าง AI Agent อัปโหลดไฟล์ความรู้ (PDF/รูปภาพ)
            และเริ่มเปิดห้องสนทนาเพื่อพูดคุยสอบถามข้อมูล
          </p>
        </div>

        {/* Stepper Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 Indicator */}
          <div
            onClick={() => setActiveStep(1)}
            className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
              activeStep === 1
                ? 'bg-white dark:bg-slate-900 border-teal-500 dark:border-cyan-500 shadow-md ring-2 ring-teal-500/20'
                : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-70'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                createdAgentId
                  ? 'bg-emerald-500 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {createdAgentId ? <CheckCircle2 className="w-5 h-5" /> : '1'}
            </div>
            <div>
              <h3 className="font-semibold text-sm">1. สร้าง AI Agent</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {createdAgentId ? `ID: ${createdAgentId}` : 'กำหนดชื่อและบทบาท'}
              </p>
            </div>
          </div>

          {/* Step 2 Indicator */}
          <div
            onClick={() => createdAgentId && setActiveStep(2)}
            className={`p-4 rounded-xl border transition-all flex items-center space-x-3 ${
              !createdAgentId
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : activeStep === 2
                  ? 'bg-white dark:bg-slate-900 border-teal-500 dark:border-cyan-500 shadow-md ring-2 ring-teal-500/20 cursor-pointer'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 cursor-pointer'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                isUploaded
                  ? 'bg-emerald-500 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {isUploaded ? <CheckCircle2 className="w-5 h-5" /> : '2'}
            </div>
            <div>
              <h3 className="font-semibold text-sm">2. อัปโหลดคลังความรู้</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isUploaded ? 'อัปโหลดเรียบร้อย' : 'รองรับ PDF, PNG, JPG'}
              </p>
            </div>
          </div>

          {/* Step 3 Indicator */}
          <div
            onClick={() => isUploaded && setActiveStep(3)}
            className={`p-4 rounded-xl border transition-all flex items-center space-x-3 ${
              !isUploaded
                ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                : activeStep === 3
                  ? 'bg-white dark:bg-slate-900 border-teal-500 dark:border-cyan-500 shadow-md ring-2 ring-teal-500/20 cursor-pointer'
                  : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 cursor-pointer'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div>
              <h3 className="font-semibold text-sm">3. เริ่ม Chat Session</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                เลือก Agent และเปิดห้องคุย
              </p>
            </div>
          </div>
        </div>

        {/* Step Content Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
          {/* ================= STEP 1: CREATE AGENT ================= */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 bg-teal-500/10 dark:bg-cyan-500/10 text-teal-600 dark:text-cyan-400 rounded-xl">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    ขั้นตอนที่ 1: สร้าง AI Agent ตัวใหม่
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ตั้งชื่อและกำหนด System Prompt เพื่อให้ AI
                    รู้ว่าต้องทำหน้าที่อะไร
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateAgent} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    ชื่อ Chatbot / Agent *
                  </label>
                  <input
                    type="text"
                    required
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="เช่น ผู้ช่วยตอบคำถามฝ่ายขาย, AI สรุปคู่มือ"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    System Prompt /คำอธิบายบทบาท
                  </label>
                  <textarea
                    rows={3}
                    value={agentPrompt}
                    onChange={(e) => setAgentPrompt(e.target.value)}
                    placeholder="เช่น คุณคือผู้ช่วย AI ที่คอยตอบคำถามจากเอกสารที่อัปโหลดอย่างสุภาพและแม่นยำ"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    !agentName.trim() || createChatbotMutation.isPending
                  }
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
                >
                  {createChatbotMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังสร้าง Agent...</span>
                    </>
                  ) : (
                    <>
                      <span>สร้าง Agent และถัดไป</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 2: UPLOAD KNOWLEDGE ================= */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 bg-teal-500/10 dark:bg-cyan-500/10 text-teal-600 dark:text-cyan-400 rounded-xl">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    ขั้นตอนที่ 2: อัปโหลดเอกสารคลังความรู้ (Knowledge)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ผูกคลังข้อมูลเข้ากับ Agent ID:{' '}
                    <span className="font-mono text-teal-600 dark:text-cyan-400 font-bold">
                      {createdAgentId}
                    </span>
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleUploadKnowledge}
                className="space-y-5 max-w-xl"
              >
                {/* Drag and Drop Zone */}
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-cyan-500 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-teal-100 dark:bg-slate-800 text-teal-600 dark:text-cyan-400 rounded-full">
                      <FolderUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        ลากไฟล์มาวางที่นี่ หรือ คลิกเพื่อเลือกไฟล์
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        รองรับรูปแบบไฟล์ PDF, PNG, JPG, WEBP
                      </p>
                    </div>
                  </div>
                </div>

                {/* Selected File Preview */}
                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-sm">
                    <div className="flex items-center space-x-3">
                      {selectedFile.type.includes('pdf') ? (
                        <FileText className="w-5 h-5 text-rose-500" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                      )}
                      <div>
                        <p className="font-medium line-clamp-1">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    {isUploaded && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={
                      !selectedFile ||
                      isUploaded ||
                      uploadKnowledgeMutation.isPending
                    }
                    className="inline-flex items-center space-x-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
                  >
                    {uploadKnowledgeMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>กำลังอัปโหลด...</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isUploaded
                            ? 'อัปโหลดเรียบร้อยแล้ว'
                            : 'อัปโหลดไปยังคลังความรู้'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= STEP 3: CREATE CHAT SESSION ================= */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="p-3 bg-teal-500/10 dark:bg-cyan-500/10 text-teal-600 dark:text-cyan-400 rounded-xl">
                  <MessageSquarePlus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    ขั้นตอนที่ 3: เปิดห้องสนทนา (Create Chat Session)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    เลือก Agent ที่พร้อมใช้งานเพื่อเริ่มพูดคุยสอบถามข้อมูล
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleStartChatSession}
                className="space-y-4 max-w-xl"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    เลือก AI Agent
                  </label>
                  <select
                    disabled
                    value={createdAgentId || ''}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 font-mono"
                  >
                    <option value={createdAgentId || ''}>
                      {agentName} ({createdAgentId}) - พร้อมใช้งาน
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    ชื่อหัวข้อสนทนา (Session Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    placeholder="เช่น สอบถามรายละเอียดโปรโมชั่น, ถามตอบจากเอกสาร"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!sessionTitle.trim() || isCreatingSession}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-md disabled:opacity-50"
                >
                  {isCreatingSession ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังสร้างห้องแชต...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>เริ่มพูดคุยกับ AI Agent</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Tip / Help Card */}
        <div className="p-4 bg-teal-50/50 dark:bg-slate-900/40 border border-teal-100 dark:border-slate-800 rounded-xl flex items-start space-x-3 text-xs text-slate-600 dark:text-slate-400">
          <HelpCircle className="w-5 h-5 text-teal-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-800 dark:text-slate-200">
              ข้อแนะนำ:
            </strong>{' '}
            เมื่ออัปโหลดไฟล์ เช่น PDF หรือรูปภาพ ระบบ RAG จะทำการย่อยเนื้อหา
            (Chunking) และทำ Vector Search เพื่อให้ AI
            ดึงข้อมูลอ้างอิงมาตอบคำถามใน Chat Session ได้อย่างแม่นยำ[cite: 2]
          </p>
        </div>
      </div>
    </div>
  )
}
