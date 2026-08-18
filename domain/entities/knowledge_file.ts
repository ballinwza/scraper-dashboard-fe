export enum FileStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
}

export interface Chunk {
  vector_id: string
  chunk_index: number
  text_content: string
  page_number: number
  token_count: number
}

export interface KnowledgeFile {
  id: string
  user_id: string
  chatbot_id: string
  filename: string
  file_type: string
  file_size_bytes: number
  status: FileStatus
  total_chunks: number
  chunks?: Chunk[]
  total_page: number
  text_content?: string
  error_message?: string
  created_at: string // ISO String สำหรับ time.Time
  updated_at: string
}
