'use client'

import {
  DeleteKnowledgeFileReqDTO,
  ListKnowledgeFilesReqDTO,
  UploadFileMultiTenantReqDTO,
} from '@/application/dto/knowledge_file.dto'
import { knowledge_container } from '@/di/container'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Query Key Constants เพื่อป้องกันการพิมพ์ผิดและจัดการ Cache ง่ายขึ้น
export const KNOWLEDGE_FILE_KEYS = {
  all: ['knowledge-files'] as const,
  detail: (id: string) => [...KNOWLEDGE_FILE_KEYS.all, 'detail', id] as const,
  list: (params: ListKnowledgeFilesReqDTO) =>
    [...KNOWLEDGE_FILE_KEYS.all, 'list', params] as const,
}

/**
 * 1. Hook สำหรับดึงข้อมูล Knowledge File รายชิ้น (GET)
 */
export function useKnowledgeFileDetail(id: string) {
  return useQuery({
    queryKey: KNOWLEDGE_FILE_KEYS.detail(id),
    queryFn: async () => {
      return await knowledge_container.getKnowledgeFileUseCase.execute(id)
    },
    enabled: Boolean(id), // รันก็ต่อเมื่อมี id ส่งมา
  })
}

/**
 * 2. Hook สำหรับดึงรายการ Knowledge Files ทั้งหมดตาม Chatbot ID (POST /list)
 */
export function useKnowledgeFileList(params: ListKnowledgeFilesReqDTO) {
  return useQuery({
    queryKey: KNOWLEDGE_FILE_KEYS.list(params),
    queryFn: async () => {
      return await knowledge_container.listKnowledgeFilesUseCase.execute(params)
    },
    enabled: Boolean(params.chatbot_id), // รันก็ต่อเมื่อมี chatbot_id
  })
}

/**
 * 3. Hook สำหรับอัปโหลด Knowledge File (POST /upload)
 */
export function useUploadKnowledgeFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadFileMultiTenantReqDTO) => {
      return await knowledge_container.uploadFileMultiTenantUseCase.execute(
        payload
      )
    },
    onSuccess: () => {
      // เมื่ออัปโหลดสำเร็จ ทำการ Invalidate ให้ดึงข้อมูล List ใหม่
      queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_FILE_KEYS.all,
      })
    },
  })
}

/**
 * 4. Hook สำหรับลบ Knowledge File (DELETE)
 */
export function useDeleteKnowledgeFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: DeleteKnowledgeFileReqDTO) => {
      return await knowledge_container.deleteKnowledgeFileUseCase.execute(
        payload
      )
    },
    onSuccess: () => {
      // เมื่อลบสำเร็จ ทำการ Refetch ข้อมูล List ใหม่
      queryClient.invalidateQueries({
        queryKey: KNOWLEDGE_FILE_KEYS.all,
      })
    },
  })
}
