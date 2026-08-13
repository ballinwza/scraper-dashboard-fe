export interface User {
  name: string
  role: string
  username: string
}

export interface JwtToken {
  accessToken: string
  refreshToken: string
}

export interface UserAuth {
  username: string
  password: string
  name?: string | null
}
