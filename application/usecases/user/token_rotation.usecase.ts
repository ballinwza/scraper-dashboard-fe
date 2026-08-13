import { JwtToken } from '@/domain/entities/user'
import { IUserRepository } from '@/domain/repositories/user.repository'

export class TokenRotationUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<JwtToken> {
    return await this.userRepository.tokenRotation()
  }
}
