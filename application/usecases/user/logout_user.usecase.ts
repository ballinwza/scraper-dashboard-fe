import { IUserRepository } from '@/domain/repositories/user.repository'

export class LogoutUserUsecase {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<void> {
    await this.userRepository.logout()
  }
}
