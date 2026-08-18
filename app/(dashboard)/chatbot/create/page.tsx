'use client'

import {
  AlertCircle,
  ArrowLeft,
  Bot,
  FileText,
  Loader2,
  Plus,
  UploadCloud,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

// Hooks
import { useCreateChatbot } from '@/presentation/hooks/useChatbot'
import { useUploadKnowledgeFile } from '@/presentation/hooks/useKnowledgeFile'
import { DEFAULT_PROMPT } from '@/shared/utils/prompt'

export default function CreateChatbotPage() {
  const router = useRouter()

  // Hooks สำหรับการจัดการ API
  const createBotMutation = useCreateChatbot()
  const uploadFileMutation = useUploadKnowledgeFile()

  // Form States
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_PROMPT)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Status/Progress States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Handler สำหรับการเลือกไฟล์
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  // Handler หลักเมื่อ Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim() || !systemPrompt.trim()) {
      setErrorMessage('กรุณากรอกชื่อ Chatbot และ System Prompt ให้ครบถ้วน')
      return
    }

    setIsSubmitting(true)

    try {
      // Step 1: สร้าง Chatbot ตัวใหม่ก่อน
      const newBotRes = await createBotMutation.mutateAsync({
        name,
        description,
        system_prompt: systemPrompt,
      })

      const newBotId = newBotRes.chatbot.id

      // Step 2: หากมีการเลือกไฟล์ ให้ทำการอัปโหลด Knowledge File ต่อทันที
      if (selectedFile && newBotId) {
        await uploadFileMutation.mutateAsync({
          chatbot_id: newBotId,
          file: selectedFile,
        })
      }

      // Step 3: เมื่อเสร็จสมบูรณ์ ย้ายหน้าไปยังรายละเอียด Chatbot
      router.push(`/chatbot/${newBotId}`)
    } catch (err: any) {
      setErrorMessage(err?.message || 'เกิดข้อผิดพลาดในการสร้าง Chatbot')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.push('/chatbot')}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        กลับไปหน้ารายการ Chatbot
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-3 bg-teal-50 dark:bg-cyan-950/50 text-teal-600 dark:text-cyan-400 rounded-xl">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            สร้าง Multi-Tenant Chatbot ใหม่
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            ตั้งค่าข้อมูลบอท พร้อมแนบไฟล์ Knowledge ตั้งต้นสำหรับระบบ RAG
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Chatbot Blueprint Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
            1. ข้อมูลพื้นฐาน (Chatbot Blueprint)
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              ชื่อ Chatbot <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="เช่น Customer Support Bot"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              คำอธิบาย (Description)
            </label>
            <input
              type="text"
              placeholder="เช่น บอทสำหรับตอบคำถามและดูแลลูกค้าเกี่ยวกับบริการอสังหาริมทรัพย์"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              System Prompt <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="กำหนดบทบาทและแนวทางการตอบของ AI เช่น You are a helpful customer support assistant..."
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* SECTION 2: Initial Knowledge Base Upload */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                2. แนบไฟล์คลังความรู้เริ่มต้น (Optional Knowledge File)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                สามารถแนบไฟล์ PDF หรือรูปภาพเพื่อใช้เป็นบริบทความรู้ตั้งต้นได้
              </p>
            </div>
          </div>

          {!selectedFile ? (
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-cyan-500 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-slate-950/30 transition-colors cursor-pointer relative">
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                disabled={isSubmitting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="p-3 bg-teal-50 dark:bg-cyan-950/50 text-teal-600 dark:text-cyan-400 rounded-full">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    คลิกหรือลากไฟล์มาวางเพื่อแนบไฟล์
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    รองรับไฟล์ PDF, PNG, JPG, WEBP
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2.5 bg-teal-100 dark:bg-cyan-950 text-teal-600 dark:text-cyan-400 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                disabled={isSubmitting}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/chatbot')}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            ยกเลิก
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                กำลังสร้าง Chatbot...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                สร้าง Chatbot
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
