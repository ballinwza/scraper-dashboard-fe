import {
  JwtResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  UserResponseDTO,
} from '@/application/dto/auth.dto'
import { IUserRepository } from '@/domain/repositories/user.repository'
import axios from 'axios'
import { axiosClient } from '../api/axios_client'

export class UserRepositoryImpl implements IUserRepository {
  async login(req: LoginRequestDTO): Promise<JwtResponseDTO> {
    const response = await axiosClient.post<JwtResponseDTO>('/auth/login', req)
    return response.data
  }

  async logout(): Promise<void> {
    await axiosClient.post<JwtResponseDTO>('/auth/logout')
  }

  async tokenRotation(): Promise<JwtResponseDTO> {
    const res = await axios.post(
      `/api/v1/auth/refresh`,
      {},
      { withCredentials: true }
    )
    return res.data
  }

  async register(req: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const response = await axiosClient.post<RegisterResponseDTO>(
      '/auth/register',
      req
    )
    return response.data
  }

  async getUser(): Promise<UserResponseDTO> {
    const response = await axiosClient.get<UserResponseDTO>('/user/username')
    return response.data
  }
}
