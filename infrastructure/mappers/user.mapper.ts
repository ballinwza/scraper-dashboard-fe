import {
  JwtResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  UserResponseDTO,
} from '@/application/dto/auth.dto'
import { JwtToken, User, UserAuth } from '@/domain/entities/user'

export class UserMapper {
  static loginReqToDomain(dto: LoginRequestDTO): UserAuth {
    return {
      ...dto,
    }
  }

  static loginResToDomain(dto: JwtResponseDTO): JwtToken {
    return {
      ...dto,
    }
  }

  static loginReqToDto(domain: UserAuth): LoginRequestDTO {
    return {
      ...domain,
    }
  }

  static loginResToDto(domain: JwtToken): JwtResponseDTO {
    return {
      ...domain,
    }
  }

  static registerResToDomain(dto: RegisterResponseDTO): User {
    return {
      name: dto.name,
      role: dto.role,
      username: dto.username,
    }
  }

  static registerReqToDomain(dto: RegisterRequestDTO): UserAuth {
    return {
      name: dto.name,
      username: dto.password,
      password: dto.password,
    }
  }

  static registerReqToDto(domain: UserAuth): RegisterRequestDTO {
    return {
      username: domain.username,
      password: domain.password,
      name: domain.name ?? '',
    }
  }

  static userToDomain(req: UserResponseDTO): User {
    return {
      name: req.name,
      role: req.role,
      username: req.username,
    }
  }
}
