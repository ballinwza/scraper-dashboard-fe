import {
  AddChatMessage,
  CreateChatSession,
  DeleteChatSession,
  GetChatSession,
  ListChatSessions,
} from '@/application/usecases/chat_session/chat_session.usecase'
import {
  CreateMultiTenantChatbot,
  DeleteMultiTenantChatbot,
  GetMultiTenantChatbot,
  ListMultiTenantChatbots,
  UpdateMultiTenantChatbot,
} from '@/application/usecases/chatbot/chatbot.usecase'
import {
  DeleteKnowledgeFile,
  GetKnowledgeFile,
  ListKnowledgeFiles,
  UploadFileMultiTenant,
} from '@/application/usecases/knowledge_file/knowledge_file.usecase'
import { SearchSimilar } from '@/application/usecases/rag/rag.usecase'
import { GetRentalEstateById } from '@/application/usecases/rental_estate/get_rental_estate_by_id.usecase'
import { GetRentalEstatesUseCase } from '@/application/usecases/rental_estate/get_rental_estates.usecase'
import { ScrappingEstateUsecase } from '@/application/usecases/scraper/scrapping_estate.usecase'
import { GetUserUsecase } from '@/application/usecases/user/get_user.usecase'
import { LoginUserUsecase } from '@/application/usecases/user/login_user.usecase'
import { LogoutUserUsecase } from '@/application/usecases/user/logout_user.usecase'
import { RegisterUserUsecase } from '@/application/usecases/user/register_user.usecase'
import { TokenRotationUsecase } from '@/application/usecases/user/token_rotation.usecase'
import { ChatSessionRepositoryImpl } from '@/infrastructure/repositories/chat_session.repository.impl'
import { ChatbotRepositoryImpl } from '@/infrastructure/repositories/chatbot.repository.impl'
import { KnowledgeFileRepositoryImpl } from '@/infrastructure/repositories/knowledge.repository.impl'
import { RagRepositoryImpl } from '@/infrastructure/repositories/rag.repository.impl'
import { RentalEstateRepositoryImpl } from '@/infrastructure/repositories/rental_estate.repository.impl'
import { ScraperRepositoryImpl } from '@/infrastructure/repositories/scraper.repository.impl'
import { UserRepositoryImpl } from '@/infrastructure/repositories/user.repository.impl'

const rentalEstateRepository = new RentalEstateRepositoryImpl()
const userRepository = new UserRepositoryImpl()
const chatbotRepository = new ChatbotRepositoryImpl()
const scraperRepository = new ScraperRepositoryImpl()

export const container = {
  getRentalEstatesUseCase: new GetRentalEstatesUseCase(rentalEstateRepository),
  getRentalEstateByIdUseCase: new GetRentalEstateById(rentalEstateRepository),
  loginUseCase: new LoginUserUsecase(userRepository),
  tokenRotationUsecase: new TokenRotationUsecase(userRepository),
  logoutUsecase: new LogoutUserUsecase(userRepository),
  registerUserUsecase: new RegisterUserUsecase(userRepository),
  getUserUsecase: new GetUserUsecase(userRepository),
  // chatbotAnswerUsecase: new GenerateAnswerUsecase(chatbotRepository),
  scrappingEstateUsecase: new ScrappingEstateUsecase(scraperRepository),
}

// Knowledge File
const knowledgeFileRepository = new KnowledgeFileRepositoryImpl()

export const getKnowledgeFileUseCase = new GetKnowledgeFile(
  knowledgeFileRepository
)
export const listKnowledgeFilesUseCase = new ListKnowledgeFiles(
  knowledgeFileRepository
)
export const deleteKnowledgeFileUseCase = new DeleteKnowledgeFile(
  knowledgeFileRepository
)
export const uploadFileMultiTenantUseCase = new UploadFileMultiTenant(
  knowledgeFileRepository
)

export const knowledge_container = {
  knowledgeFileRepository,
  getKnowledgeFileUseCase,
  listKnowledgeFilesUseCase,
  deleteKnowledgeFileUseCase,
  uploadFileMultiTenantUseCase,
}

// Chatbot
export const createMultiTenantChatbotUseCase = new CreateMultiTenantChatbot(
  chatbotRepository
)
export const getMultiTenantChatbotUseCase = new GetMultiTenantChatbot(
  chatbotRepository
)
export const listMultiTenantChatbotsUseCase = new ListMultiTenantChatbots(
  chatbotRepository
)
export const updateMultiTenantChatbotUseCase = new UpdateMultiTenantChatbot(
  chatbotRepository
)
export const deleteMultiTenantChatbotUseCase = new DeleteMultiTenantChatbot(
  chatbotRepository
)

export const chatbot_container = {
  chatbotRepository,
  createMultiTenantChatbotUseCase,
  getMultiTenantChatbotUseCase,
  listMultiTenantChatbotsUseCase,
  updateMultiTenantChatbotUseCase,
  deleteMultiTenantChatbotUseCase,
}

// Chat Session
const chatSessionRepository = new ChatSessionRepositoryImpl()

export const createChatSessionUseCase = new CreateChatSession(
  chatSessionRepository
)
export const getChatSessionUseCase = new GetChatSession(chatSessionRepository)
export const listChatSessionsUseCase = new ListChatSessions(
  chatSessionRepository
)
export const addChatMessageUseCase = new AddChatMessage(chatSessionRepository)
export const deleteChatSessionUseCase = new DeleteChatSession(
  chatSessionRepository
)

export const chat_session_container = {
  chatSessionRepository,
  createChatSessionUseCase,
  getChatSessionUseCase,
  listChatSessionsUseCase,
  addChatMessageUseCase,
  deleteChatSessionUseCase,
}

// RAG
const ragRepository = new RagRepositoryImpl()

export const searchSimilarUseCase = new SearchSimilar(ragRepository)

export const rag_container = {
  ragRepository,
  searchSimilarUseCase,
}
