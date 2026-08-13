'use client'

import { LoginRequestDTO } from '@/application/dto/auth.dto'
import { UserAuth } from '@/domain/entities/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { container } from '../../di/container'
import { useAuthStore } from '../stores/authStore'
import { CookieService } from '../stores/cookieService'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, setUser } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequestDTO) => {
      const { accessToken, refreshToken } =
        await container.loginUseCase.execute(credentials)
      CookieService.setTokens(accessToken, refreshToken)
    },
    onSuccess: () => {
      queryClient.clear()
      router.push('/dashboard')
    },
    onError: (err) => {
      toast.error(`Login failed`)
    },
  })

  const userQueru = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const userData = await container.getUserUsecase.execute()
      setUser(userData)
      return userData
    },
    enabled: CookieService.hasAccessToken(), // ยิง API เฉพาะตอนที่มี Token เท่านั้น (ป้องกันยิงฟรีตอนไม่ได้ล็อกอิน)
    staleTime: 1000 * 60 * 15, // ⏱️ ตั้งเวลา 15 นาที: ตราบใดที่ยังไม่พ้น 15 นาที จะดึงจาก Cache โดยไม่ยิง API ซ้ำ
    gcTime: 1000 * 60 * 60, // 🧹 เก็บ Cache ไว้ 1 ชั่วโมง
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await container.logoutUsecase.execute()
    },
    onSuccess: () => {
      CookieService.clearTokens()
      queryClient.clear()
      router.push('/')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (dto: UserAuth) => container.registerUserUsecase.execute(dto),
    onSuccess: (session) => {
      setUser(session)
      router.push('/')
    },
    onError: (err) => {
      toast.error(`An error occurred during registration.`)
    },
  })

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    getUser: userQueru.refetch,
  }
}
