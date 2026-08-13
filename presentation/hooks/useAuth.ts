'use client'

import { LoginRequestDTO } from '@/application/dto/auth.dto'
import { UserAuth } from '@/domain/entities/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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

      await new Promise((resolve) => setTimeout(resolve, 50))
      const userUsercase = await container.getUserUsecase.execute()
      return { user: userUsercase }
    },
    onSuccess: ({ user }) => {
      setUser(user)
      queryClient.clear()
      router.push('/dashboard')
    },
    onError: (err) => {
      toast.error(`Login failed`)
    },
  })

  const getUserMutation = useMutation({
    mutationFn: async () => {
      const userUsercase = await container.getUserUsecase.execute()
      return { user: userUsercase }
    },
    onSuccess: ({ user }) => {
      setUser(user)
    },
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
    getUser: getUserMutation.mutateAsync,
  }
}
