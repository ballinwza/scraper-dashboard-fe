import {
  SearchSimilarReqDTO,
  SearchSimilarResDTO,
} from '@/application/dto/rag.dto'
import { IRagRepository } from '@/domain/repositories/rag.repository'

export class SearchSimilar {
  constructor(private ragRepository: IRagRepository) {}

  /**
   * ค้นหาเนื้อหาที่คล้ายคลึงกัน (RAG Search)
   * @param req ข้อมูลคำค้นหา (chatbot_id, query_text, top_k, knowledge_file_id)
   */
  async execute(req: SearchSimilarReqDTO): Promise<SearchSimilarResDTO> {
    // Validation
    if (!req.chatbot_id) {
      throw new Error('Chatbot ID is required')
    }

    if (!req.query_text || req.query_text.trim() === '') {
      throw new Error('Query text cannot be empty')
    }

    // Default top_k หากไม่ได้ส่งเข้ามา
    const payload: SearchSimilarReqDTO = {
      ...req,
      top_k: req.top_k ?? 5,
    }

    return await this.ragRepository.searchSimilar(payload)
  }
}
