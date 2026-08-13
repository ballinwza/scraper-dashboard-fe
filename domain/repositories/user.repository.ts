import {
  JwtResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  UserResponseDTO,
} from '@/application/dto/auth.dto'

export interface IUserRepository {
  login(req: LoginRequestDTO): Promise<JwtResponseDTO>
  logout(): Promise<void>
  tokenRotation(): Promise<JwtResponseDTO>
  register(user: RegisterRequestDTO): Promise<RegisterResponseDTO>
  getUser(): Promise<UserResponseDTO>
}
