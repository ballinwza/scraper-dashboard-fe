// --- Request DTOs ---

import { FileStatus, KnowledgeFile } from '@/domain/entities/knowledge_file'

export interface GetKnowledgeFileReqDTO {
  id: string
}

export interface ListKnowledgeFilesReqDTO {
  chatbot_id: string
  limit?: number // default: 10
  offset?: number // default: 0
}

export interface DeleteKnowledgeFileReqDTO {
  chatbot_id: string
}

export interface MultiTenantUploadFileReqDTO {
  user_id: string
  chatbot_id: string
}

export interface UploadFileMultiTenantReqDTO {
  chatbot_id: string
  file: File | Blob
}

// --- Response DTOs ---

export interface GetKnowledgeFileResponse {
  file: KnowledgeFile
}

export interface ListKnowledgeFilesResponse {
  files: KnowledgeFile[]
  total_count: number
}

export interface DeleteKnowledgeFileResponse {
  success: boolean
  message: string
}

export interface UploadFileMultiTenantResponse {
  file_id: string
  status: FileStatus
  total_chunks: number
  total_bytes: number
  message: string
  created_at: string
}

export interface UploadPdfResponse {
  file_id: string
  success: boolean
  message: string
}

export interface UploadFileMultiTenantRes {
  file_id: string
  status: string
  total_chunks: number
  total_bytes: number
  message: string
}
