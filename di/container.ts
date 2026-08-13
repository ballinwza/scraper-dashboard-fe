import { GenerateAnswerUsecase } from '@/application/usecases/chatbot/generate_answer.usecase'
import { GetRentalEstateById } from '@/application/usecases/rental_estate/get_rental_estate_by_id.usecase'
import { GetRentalEstatesUseCase } from '@/application/usecases/rental_estate/get_rental_estates.usecase'
import { GetUserUsecase } from '@/application/usecases/user/get_user.usecase'
import { LoginUserUsecase } from '@/application/usecases/user/login_user.usecase'
import { LogoutUserUsecase } from '@/application/usecases/user/logout_user.usecase'
import { RegisterUserUsecase } from '@/application/usecases/user/register_user.usecase'
import { TokenRotationUsecase } from '@/application/usecases/user/token_rotation.usecase'
import { ChatbotRepositoryImpl } from '@/infrastructure/repositories/chatbor.repository.impl'
import { RentalEstateRepositoryImpl } from '@/infrastructure/repositories/rental_estate.repository.impl'
import { UserRepositoryImpl } from '@/infrastructure/repositories/user.repository.impl'

const rentalEstateRepository = new RentalEstateRepositoryImpl()
const userRepository = new UserRepositoryImpl()
const chatbotRepository = new ChatbotRepositoryImpl()

export const container = {
  getRentalEstatesUseCase: new GetRentalEstatesUseCase(rentalEstateRepository),
  getRentalEstateByIdUseCase: new GetRentalEstateById(rentalEstateRepository),
  loginUseCase: new LoginUserUsecase(userRepository),
  tokenRotationUsecase: new TokenRotationUsecase(userRepository),
  logoutUsecase: new LogoutUserUsecase(userRepository),
  registerUserUsecase: new RegisterUserUsecase(userRepository),
  getUserUsecase: new GetUserUsecase(userRepository),
  chatbotAnswerUsecase: new GenerateAnswerUsecase(chatbotRepository),
}
