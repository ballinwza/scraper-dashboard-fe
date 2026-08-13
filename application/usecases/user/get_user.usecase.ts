import { User } from '@/domain/entities/user'
import { IUserRepository } from '@/domain/repositories/user.repository'
import { UserMapper } from '@/infrastructure/mappers/user.mapper'

export class GetUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User> {
    const res = await this.userRepository.getUser()
    return UserMapper.userToDomain(res)
  }
}
