import { GetRentalEstateById } from '@/application/usecases/rental_estate/get_rental_estate_by_id.usecase'
import { GetRentalEstatesUseCase } from '@/application/usecases/rental_estate/get_rental_estates.usecase'
import { RentalEstateRepositoryImpl } from '@/infrastructure/repositories/rental_estate.repository.impl'

const rentalEstateRepository = new RentalEstateRepositoryImpl()

export const container = {
  getRentalEstatesUseCase: new GetRentalEstatesUseCase(rentalEstateRepository),
  getRentalEstateByIdUseCase: new GetRentalEstateById(rentalEstateRepository),
}
