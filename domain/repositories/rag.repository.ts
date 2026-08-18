import {
  SearchSimilarReqDTO,
  SearchSimilarResDTO,
} from '@/application/dto/rag.dto'

export interface IRagRepository {
  /**
   * ค้นหาเนื้อหาที่คล้ายคลึงกัน (RAG Search)
   * POST /rag/search-similar
   */
  searchSimilar(req: SearchSimilarReqDTO): Promise<SearchSimilarResDTO>
}
