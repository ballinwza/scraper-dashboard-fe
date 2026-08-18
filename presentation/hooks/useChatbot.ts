'use client'

import {
  CreateMultiTenantChatbotReqDTO,
  DeleteMultiTenantChatbotReqDTO,
  ListMultiTenantChatbotsReqDTO,
  UpdateMultiTenantChatbotReqDTO,
} from '@/application/dto/chatbot.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { chatbot_container } from '../../di/container'

// Query Keys Constant สำหรับจัดการ Cache
export const CHATBOT_KEYS = {
  all: ['chatbots'] as const,
  detail: (id: string) => [...CHATBOT_KEYS.all, 'detail', id] as const,
  list: (params?: ListMultiTenantChatbotsReqDTO) =>
    [...CHATBOT_KEYS.all, 'list', params] as const,
}

/**
 * 1. Hook สำหรับดึงข้อมูล Chatbot รายตัวตาม ID (GET)
 */
export function useChatbotDetail(id: string) {
  return useQuery({
    queryKey: CHATBOT_KEYS.detail(id),
    queryFn: async () => {
      return await chatbot_container.getMultiTenantChatbotUseCase.execute(id)
    },
    enabled: Boolean(id), // จะรันเมื่อมี id ส่งเข้ามาเท่านั้น
  })
}

/**
 * 2. Hook สำหรับดึงรายการ Chatbots แบบ Pagination (GET/POST List)
 */
export function useChatbotList(params: ListMultiTenantChatbotsReqDTO = {}) {
  return useQuery({
    queryKey: CHATBOT_KEYS.list(params),
    queryFn: async () => {
      return await chatbot_container.listMultiTenantChatbotsUseCase.execute(
        params
      )
    },
  })
}

/**
 * 3. Hook สำหรับสร้าง Chatbot ใหม่ (POST)
 */
export function useCreateChatbot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateMultiTenantChatbotReqDTO) => {
      return await chatbot_container.createMultiTenantChatbotUseCase.execute(
        payload
      )
    },
    onSuccess: () => {
      // เมื่อสร้างสำเร็จ ให้ Invalidate เพื่อดึงรายการ List ใหม่ล่าสุด
      queryClient.invalidateQueries({
        queryKey: CHATBOT_KEYS.all,
      })
    },
  })
}

/**
 * 4. Hook สำหรับอัปเดต Chatbot (POST/PUT)
 */
export function useUpdateChatbot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateMultiTenantChatbotReqDTO) => {
      return await chatbot_container.updateMultiTenantChatbotUseCase.execute(
        payload
      )
    },
    onSuccess: (data) => {
      // Refresh ข้อมูลใน List และ Detail ของตัวที่เพิ่งแก้ไข
      queryClient.invalidateQueries({
        queryKey: CHATBOT_KEYS.all,
      })
      queryClient.invalidateQueries({
        queryKey: CHATBOT_KEYS.detail(data.chatbot.id),
      })
    },
  })
}

/**
 * 5. Hook สำหรับลบ Chatbot (DELETE)
 */
export function useDeleteChatbot() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: DeleteMultiTenantChatbotReqDTO) => {
      return await chatbot_container.deleteMultiTenantChatbotUseCase.execute(
        payload
      )
    },
    onSuccess: () => {
      // Refresh ข้อมูลรายการ Chatbot ทั้งหมด
      queryClient.invalidateQueries({
        queryKey: CHATBOT_KEYS.all,
      })
    },
  })
}
