import {
  CreateMultiTenantChatbotReqDTO,
  CreateMultiTenantChatbotResDTO,
  DeleteMultiTenantChatbotReqDTO,
  DeleteMultiTenantChatbotResDTO,
  GetMultiTenantChatbotResDTO,
  ListMultiTenantChatbotsReqDTO,
  ListMultiTenantChatbotsResDTO,
  UpdateMultiTenantChatbotReqDTO,
  UpdateMultiTenantChatbotResDTO,
} from '@/application/dto/chatbot.dto'
import { IChatbotRepository } from '@/domain/repositories/chatbot.repository'
import { axiosClient } from '../api/axios_client'

export class ChatbotRepositoryImpl implements IChatbotRepository {
  /**
   * สร้าง Multi-Tenant Chatbot ใหม่
   * POST /chatbots/create
   */
  async createMultiTenantChatbot(
    req: CreateMultiTenantChatbotReqDTO
  ): Promise<CreateMultiTenantChatbotResDTO> {
    const response = await axiosClient.post<CreateMultiTenantChatbotResDTO>(
      '/chatbots/create',
      req,
      {
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * ดึงข้อมูล Chatbot รายตัวตาม ID
   * GET /chatbots/{id}
   */
  async getMultiTenantChatbot(
    id: string
  ): Promise<GetMultiTenantChatbotResDTO> {
    const response = await axiosClient.get<GetMultiTenantChatbotResDTO>(
      `/chatbots/${id}`,
      {
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * ดึงรายการ Chatbots แบบ Pagination ผ่าน Query Parameters
   * GET /chatbots/list (หรือ POST ตาม Controller Spec)
   */
  async listMultiTenantChatbots(
    req: ListMultiTenantChatbotsReqDTO
  ): Promise<ListMultiTenantChatbotsResDTO> {
    const response = await axiosClient.post<ListMultiTenantChatbotsResDTO>(
      '/chatbots/list',
      {
        page_size: req.page_size ?? 10,
        page_token: req.page_token ?? 0,
      }
    )
    return response.data
  }

  /**
   * อัปเดตข้อมูล Chatbot
   * POST /chatbots/update
   */
  async updateMultiTenantChatbot(
    req: UpdateMultiTenantChatbotReqDTO
  ): Promise<UpdateMultiTenantChatbotResDTO> {
    const response = await axiosClient.post<UpdateMultiTenantChatbotResDTO>(
      '/chatbots/update',
      req,
      {
        withCredentials: true,
      }
    )
    return response.data
  }

  /**
   * ลบ Chatbot ตาม ID
   * DELETE /chatbots/delete
   */
  async deleteMultiTenantChatbot(
    req: DeleteMultiTenantChatbotReqDTO
  ): Promise<DeleteMultiTenantChatbotResDTO> {
    const response = await axiosClient.delete<DeleteMultiTenantChatbotResDTO>(
      '/chatbots/delete',
      {
        data: req,
        withCredentials: true,
      }
    )
    return response.data
  }
}
