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

export interface IChatSessionRepository {
  /**
   * สร้าง Chat Session ใหม่
   * POST /chat-sessions/create
   */
  createChatSession(
    req: CreateChatSessionReqDTO
  ): Promise<CreateChatSessionResDTO>

  /**
   * ดึงรายละเอียด Chat Session และประวัติการสนทนาตาม ID
   * GET /chat-sessions/{id}
   */
  getChatSession(id: string): Promise<GetChatSessionResDTO>

  /**
   * ดึงรายการ Chat Sessions แบบ Pagination
   * POST /chat-sessions/list (หรือ Query Params ตาม Handler)
   */
  listChatSessions(req: ListChatSessionsReqDTO): Promise<ListChatSessionsResDTO>

  /**
   * เพิ่มข้อความลงใน Chat Session
   * POST /chat-sessions/messages
   */
  addChatMessage(req: AddChatMessageReqDTO): Promise<AddChatMessageResDTO>

  /**
   * ลบ Chat Session ตาม ID
   * DELETE /chat-sessions/delete
   */
  deleteChatSession(
    req: DeleteChatSessionReqDTO
  ): Promise<DeleteChatSessionResDTO>
}
