export interface MetadataVectorRecordDTO {
  user_id: string
  chatbot_id: string
  file_id: string
  chunk_index: number
  text_content: string
  page_number: number
  filename: string
}

export interface VectorRecordDTO {
  id: string
  values?: number[]
  metadata: MetadataVectorRecordDTO
}

export interface SearchVectorRecordItemDTO {
  score: number
  record: VectorRecordDTO
}

// Request DTO
export interface SearchSimilarReqDTO {
  chatbot_id: string
  query_text: string
  top_k?: number
  knowledge_file_id?: string
}

// Response DTO
export interface SearchSimilarResDTO {
  answer_message: string
  sources: SearchVectorRecordItemDTO[]
}
