import { JwtToken, UserAuth } from '@/domain/entities/user'
import { IUserRepository } from '@/domain/repositories/user.repository'
import { UserMapper } from '@/infrastructure/mappers/user.mapper'

export class LoginUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(req: UserAuth): Promise<JwtToken> {
    const dto = UserMapper.loginReqToDto(req)
    return await this.userRepository.login(dto)
  }
}
