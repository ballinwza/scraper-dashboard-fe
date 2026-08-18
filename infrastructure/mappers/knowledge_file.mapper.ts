import { GetKnowledgeFileResponse } from '@/application/dto/knowledge_file.dto'
import { KnowledgeFile } from '@/domain/entities/knowledge_file'

export class KnowledgeFileMapper {
  static toDomain(dto: GetKnowledgeFileResponse): KnowledgeFile {
    return dto.file
  }
}
