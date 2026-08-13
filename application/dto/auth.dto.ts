export interface LoginRequestDTO {
  username: string
  password: string
}

export interface JwtResponseDTO {
  accessToken: string
  refreshToken: string
}

export interface RegisterRequestDTO {
  username: string
  password: string
  name: string
}

export interface RegisterResponseDTO {
  id?: string
  message: string
  name: string
  role: string
  username: string
}

export interface UserResponseDTO {
  id: string
  message: string
  name: string
  role: string
  username: string
  is_active: boolean
}
