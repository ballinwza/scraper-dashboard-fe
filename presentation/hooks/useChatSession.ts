import {
  AddChatMessageReqDTO,
  CreateChatSessionReqDTO,
  DeleteChatSessionReqDTO,
  ListChatSessionsReqDTO,
} from '@/application/dto/chat_session.dto'
import {
  addChatMessageUseCase,
  createChatSessionUseCase,
  deleteChatSessionUseCase,
  getChatSessionUseCase,
  listChatSessionsUseCase,
} from '@/di/container'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Keys สำหรับจัดการ Cache ใน TanStack Query
export const CHAT_SESSION_KEYS = {
  all: ['chatSessions'] as const,
  lists: () => [...CHAT_SESSION_KEYS.all, 'list'] as const,
  list: (filters: ListChatSessionsReqDTO) =>
    [...CHAT_SESSION_KEYS.lists(), filters] as const,
  details: () => [...CHAT_SESSION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...CHAT_SESSION_KEYS.details(), id] as const,
}

export const useChatSession = (activeSessionId?: string) => {
  const queryClient = useQueryClient()

  // ---------------------------------------------------------------------------
  // 1. Queries (ดึงข้อมูล)
  // ---------------------------------------------------------------------------

  /**
   * ดึงรายการ Chat Sessions ทั้งหมด (Paginated)
   */
  const useListSessions = (params: ListChatSessionsReqDTO = {}) => {
    return useQuery({
      queryKey: CHAT_SESSION_KEYS.list(params),
      queryFn: () => listChatSessionsUseCase.execute(params),
    })
  }

  /**
   * ดึงรายละเอียด Chat Session และประวัติการสนทนาตาม Session ID
   */
  const useGetSessionDetail = (sessionId: string) => {
    return useQuery({
      queryKey: CHAT_SESSION_KEYS.detail(sessionId),
      queryFn: () => getChatSessionUseCase.execute(sessionId),
      enabled: Boolean(sessionId), // ทำงานเฉพาะเมื่อมี sessionId
    })
  }

  // ---------------------------------------------------------------------------
  // 2. Mutations (จัดการข้อมูล / สร้าง / แก้ไข / ลบ)
  // ---------------------------------------------------------------------------

  /**
   * สร้าง Chat Session ใหม่
   */
  const createSessionMutation = useMutation({
    mutationFn: (req: CreateChatSessionReqDTO) =>
      createChatSessionUseCase.execute(req),
    onSuccess: () => {
      // Invalidate list เพื่อให้ดึงรายการห้องแชทล่าสุด
      queryClient.invalidateQueries({ queryKey: CHAT_SESSION_KEYS.lists() })
    },
  })

  /**
   * ส่งข้อความ/เพิ่มข้อความลงใน Chat Session
   */
  const addMessageMutation = useMutation({
    mutationFn: (req: AddChatMessageReqDTO) =>
      addChatMessageUseCase.execute(req),
    onSuccess: (_, variables) => {
      // Invalidate detail ของ session นั้นเพื่ออัปเดตข้อความล่าสุด
      queryClient.invalidateQueries({
        queryKey: CHAT_SESSION_KEYS.detail(variables.session_id),
      })
    },
  })

  /**
   * ลบ Chat Session
   */
  const deleteSessionMutation = useMutation({
    mutationFn: (req: DeleteChatSessionReqDTO) =>
      deleteChatSessionUseCase.execute(req),
    onSuccess: (_, variables) => {
      // ลบ cache ของ session ที่ถูกลบ และอัปเดต list
      queryClient.removeQueries({
        queryKey: CHAT_SESSION_KEYS.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: CHAT_SESSION_KEYS.lists() })
    },
  })

  // ---------------------------------------------------------------------------
  // Return Interfaces & Methods
  // ---------------------------------------------------------------------------
  return {
    // Queries Hooks
    useListSessions,
    useGetSessionDetail,

    // Current Session Data (ถ้ามีการส่ง activeSessionId เข้ามา)
    currentSessionQuery: useGetSessionDetail(activeSessionId || ''),

    // Action Methods
    createSession: createSessionMutation.mutateAsync,
    isCreatingSession: createSessionMutation.isPending,

    addMessage: addMessageMutation.mutateAsync,
    isSendingMessage: addMessageMutation.isPending,

    deleteSession: deleteSessionMutation.mutateAsync,
    isDeletingSession: deleteSessionMutation.isPending,
  }
}
