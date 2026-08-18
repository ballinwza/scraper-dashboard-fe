'use client'

import {
  SearchSimilarReqDTO,
  SearchSimilarResDTO,
} from '@/application/dto/rag.dto'
import { rag_container } from '@/di/container'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook สำหรับค้นหาเนื้อหาที่คล้ายคลึงกัน (RAG Similarity Search)
 */
export function useSearchSimilar() {
  return useMutation<SearchSimilarResDTO, Error, SearchSimilarReqDTO>({
    mutationFn: async (payload: SearchSimilarReqDTO) => {
      // เรียกใช้งาน searchSimilarUseCase ผ่าน container
      return await rag_container.searchSimilarUseCase.execute(payload)
    },
    onError: (error) => {
      toast.error(error.message || 'เกิดข้อผิดพลาดในการค้นหาข้อมูล')
    },
  })
}
