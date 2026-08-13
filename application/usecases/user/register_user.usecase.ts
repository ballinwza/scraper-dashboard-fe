import { User, UserAuth } from '@/domain/entities/user'
import { IUserRepository } from '@/domain/repositories/user.repository'
import { UserMapper } from '@/infrastructure/mappers/user.mapper'

export class RegisterUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(req: UserAuth): Promise<User> {
    const dto = UserMapper.registerReqToDto(req)

    const res = await this.userRepository.register(dto)

    return UserMapper.registerResToDomain(res)
  }
}
