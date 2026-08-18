'use client'

import {
  AlertCircle,
  ArrowLeft,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Database,
  Edit3,
  FileText,
  Layers,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
  XCircle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { FileStatus } from '@/domain/entities/knowledge_file'
import {
  useChatbotDetail,
  useUpdateChatbot,
} from '@/presentation/hooks/useChatbot'
import {
  useDeleteKnowledgeFile,
  useKnowledgeFileList,
  useUploadKnowledgeFile,
} from '@/presentation/hooks/useKnowledgeFile'

export default function ChatbotDetailPage() {
  const router = useRouter()
  const params = useParams()
  const chatbotId = params?.id as string

  // ---------------------------------------------------------------------------
  // 1. Data Fetching Hooks
  // ---------------------------------------------------------------------------
  const {
    data: botData,
    isLoading: isBotLoading,
    isError: isBotError,
    error: botError,
  } = useChatbotDetail(chatbotId)

  const {
    data: knowledgeData,
    isLoading: isKnowledgeLoading,
    isError: isKnowledgeError,
  } = useKnowledgeFileList({
    chatbot_id: chatbotId,
    limit: 50,
    offset: 0,
  })

  // Mutations
  const updateChatbotMutation = useUpdateChatbot()
  const uploadFileMutation = useUploadKnowledgeFile()
  const deleteFileMutation = useDeleteKnowledgeFile()

  // State สำหรับเก็บ ID ของไฟล์ที่กำลังถูกสั่งลบ (เพื่อแสดง Spinner เฉพาะปุ่มของแถวนั้น)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // 2. Local State Management
  // ---------------------------------------------------------------------------
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    system_prompt: '',
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (botData?.chatbot) {
      setEditForm({
        name: botData.chatbot.name || '',
        description: botData.chatbot.description || '',
        system_prompt: botData.chatbot.system_prompt || '',
      })
    }
  }, [botData])

  // ---------------------------------------------------------------------------
  // 3. Handlers
  // ---------------------------------------------------------------------------
  const handleSaveChatbot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatbotId) return

    updateChatbotMutation.mutate(
      {
        id: chatbotId,
        name: editForm.name,
        description: editForm.description,
        system_prompt: editForm.system_prompt,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !chatbotId) return

    uploadFileMutation.mutate(
      {
        chatbot_id: chatbotId,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          setSelectedFile(null)
          const fileInput = document.getElementById(
            'knowledge-upload'
          ) as HTMLInputElement
          if (fileInput) fileInput.value = ''
        },
      }
    )
  }

  // ลบ Knowledge Files ทั้งหมด
  const handleDeleteKnowledge = () => {
    if (
      confirm(
        'คุณแน่ใจหรือไม่ว่าต้องการลบ Knowledge Files ทั้งหมดของ Chatbot นี้?'
      )
    ) {
      deleteFileMutation.mutate({
        chatbot_id: chatbotId,
      })
    }
  }

  // ลบ Knowledge File เฉพาะรายการที่เลือก
  const handleDeleteSpecificKnowledge = (fileId: string, filename: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบไฟล์ "${filename}" ?`)) {
      setDeletingFileId(fileId)
      deleteFileMutation.mutate(
        {
          chatbot_id: chatbotId,
        },
        {
          onSettled: () => {
            setDeletingFileId(null)
          },
        }
      )
    }
  }

  const renderStatusBadge = (status: FileStatus) => {
    switch (status) {
      case FileStatus.COMPLETED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
          </span>
        )
      case FileStatus.FAILED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-800">
            <XCircle className="w-3.5 h-3.5" /> FAILED
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3.5 h-3.5 animate-spin" /> PENDING
          </span>
        )
    }
  }

  if (isBotLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600 dark:text-cyan-400" />
        <p className="text-sm font-medium">กำลังโหลดข้อมูล Chatbot...</p>
      </div>
    )
  }

  if (isBotError || !botData?.chatbot) {
    return (
      <div className="max-w-4xl mx-auto m-6 p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl space-y-4 text-red-700 dark:text-red-400">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <h2 className="text-lg font-semibold">ไม่พบข้อมูล Chatbot</h2>
        </div>
        <p className="text-sm">
          {(botError as Error)?.message ||
            'ไม่สามารถโหลดข้อมูล Chatbot ได้ กรุณาลองใหม่อีกครั้ง'}
        </p>
        <button
          onClick={() => router.push('/chatbot')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปรายการ
        </button>
      </div>
    )
  }

  const chatbot = botData.chatbot

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/chatbot')}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปรายการ Chatbots
      </button>

      {/* SECTION 1: Chatbot Detail & Edit Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-teal-50 dark:bg-cyan-950/50 text-teal-600 dark:text-cyan-400 rounded-xl">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {chatbot.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <Calendar className="w-3.5 h-3.5" /> สร้างเมื่อ:{' '}
                {new Date(chatbot.created_at).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg text-sm transition-colors"
            >
              <Edit3 className="w-4 h-4" /> แก้ไขข้อมูล
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-lg text-sm transition-colors"
            >
              <X className="w-4 h-4" /> ยกเลิก
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveChatbot} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                ชื่อ Chatbot
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                รายละเอียด (Description)
              </label>
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                System Prompt
              </label>
              <textarea
                rows={4}
                value={editForm.system_prompt}
                onChange={(e) =>
                  setEditForm({ ...editForm, system_prompt: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                disabled={updateChatbotMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {updateChatbotMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                รายละเอียด
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                {chatbot.description || 'ไม่มีรายละเอียดอธิบายเพิ่มเติม'}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                System Prompt
              </h3>
              <div className="mt-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                <p className="text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {chatbot.system_prompt}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Knowledge File Management */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
              จัดการ Knowledge Base
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              ไฟล์เอกสาร (PDF, Image) สำหรับนำไปทำ RAG ให้กับ Chatbot
            </p>
          </div>

          {/* {knowledgeData?.files && knowledgeData.files.length > 0 && (
            <button
              onClick={handleDeleteKnowledge}
              disabled={deleteFileMutation.isPending}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/40 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {deleteFileMutation.isPending && !deletingFileId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              ลบ Knowledge ทั้งหมด
            </button>
          )} */}
        </div>

        {/* Upload Form */}
        <form
          onSubmit={handleFileUpload}
          className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            id="knowledge-upload"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-500 dark:text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-xs file:font-semibold
              file:bg-teal-50 file:text-teal-700
              hover:file:bg-teal-100
              dark:file:bg-cyan-950/50 dark:file:text-cyan-400"
          />

          <button
            type="submit"
            disabled={!selectedFile || uploadFileMutation.isPending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-50 shrink-0"
          >
            {uploadFileMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            อัปโหลดไฟล์
          </button>
        </form>

        {/* Knowledge File List */}
        {isKnowledgeLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600 dark:text-cyan-400" />
          </div>
        ) : isKnowledgeError ? (
          <p className="text-xs text-red-500 text-center py-4">
            เกิดข้อผิดพลาดในการดึงรายการ Knowledge Files
          </p>
        ) : knowledgeData?.files.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto stroke-1" />
            <p className="text-sm">
              ยังไม่มีเอกสาร Knowledge Base สำหรับ Chatbot ตัวนี้
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950 text-xs font-semibold uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">ชื่อไฟล์</th>
                  <th className="py-3 px-4">ชนิด</th>
                  <th className="py-3 px-4">จำนวน Chunks</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4">วันที่สร้าง</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {knowledgeData?.files.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-200 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600 dark:text-cyan-400 shrink-0" />
                      <span className="line-clamp-1">{file.filename}</span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono uppercase">
                      {file.file_type}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        {file.total_chunks || 0} Chunks
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {renderStatusBadge(file.status)}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-400">
                      {new Date(file.created_at).toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() =>
                          handleDeleteSpecificKnowledge(file.id, file.filename)
                        }
                        disabled={
                          deleteFileMutation.isPending &&
                          deletingFileId === file.id
                        }
                        title="ลบไฟล์นี้"
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleteFileMutation.isPending &&
                        deletingFileId === file.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
