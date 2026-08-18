import {
  SearchSimilarReqDTO,
  SearchSimilarResDTO,
} from '@/application/dto/rag.dto'
import { IRagRepository } from '@/domain/repositories/rag.repository'
import { axiosClient } from '../api/axios_client'

export class RagRepositoryImpl implements IRagRepository {
  /**
   * ค้นหา Vector Similarity และสร้างคำตอบจาก RAG
   * POST /rag/search-similar
   */
  async searchSimilar(req: SearchSimilarReqDTO): Promise<SearchSimilarResDTO> {
    const response = await axiosClient.post<SearchSimilarResDTO>(
      '/rag/search-similar',
      req,
      {
        withCredentials: true, // แนบ HTTP-Only Cookie เพื่อส่ง Session ไปยัง Server
      }
    )
    return response.data
  }
}
