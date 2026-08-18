import {
  AddChatMessageReqDTO,
  AddChatMessageResDTO,
  CreateChatSessionReqDTO,
  CreateChatSessionResDTO,
  DeleteChatSessionReqDTO,
  DeleteChatSessionResDTO,
  GetChatSessionResDTO,
  ListChatSessionsReqDTO,
  ListChatSessionsResDTO,
} from '@/application/dto/chat_session.dto'
import { IChatSessionRepository } from '@/domain/repositories/chat_session.repository'
import { axiosClient } from '../api/axios_client'

export class ChatSessionRepositoryImpl implements IChatSessionRepository {
  /**
   * สร้าง Chat Session ใหม่
   * POST /chat-sessions/create
   */
  async createChatSession(
    req: CreateChatSessionReqDTO
  ): Promise<CreateChatSessionResDTO> {
    const response = await axiosClient.post<CreateChatSessionResDTO>(
      '/chat-sessions/create',
      req,
      {
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * ดึงรายละเอียด Chat Session และประวัติการสนทนาตาม ID
   * GET /chat-sessions/{id}
   */
  async getChatSession(id: string): Promise<GetChatSessionResDTO> {
    const response = await axiosClient.get<GetChatSessionResDTO>(
      `/chat-sessions/${id}`,
      {
        withCredentials: true,
      }
    )

    return response.data
  }

  /**
   * ดึงรายการ Chat Sessions แบบ Pagination
   * POST /chat-sessions/list
   */
  async listChatSessions(
    req: ListChatSessionsReqDTO
  ): Promise<ListChatSessionsResDTO> {
    const response = await axiosClient.post<ListChatSessionsResDTO>(
      '/chat-sessions/list',
      req,
      {
        params: {
          chatbot_id: req.chatbot_id,
          page_size: req.page_size ?? 20,
          page_token: req.page_token ?? 0,
        },
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * เพิ่มข้อความสนทนาลงใน Session
   * POST /chat-sessions/messages
   */
  async addChatMessage(
    req: AddChatMessageReqDTO
  ): Promise<AddChatMessageResDTO> {
    const response = await axiosClient.post<AddChatMessageResDTO>(
      '/chat-sessions/messages',
      req,
      {
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * ลบ Chat Session ตาม ID
   * DELETE /chat-sessions/delete
   */
  async deleteChatSession(
    req: DeleteChatSessionReqDTO
  ): Promise<DeleteChatSessionResDTO> {
    const response = await axiosClient.delete<DeleteChatSessionResDTO>(
      '/chat-sessions/delete',
      {
        data: req,
        withCredentials: true,
      }
    )
    return response.data
  }
}
