import {
  PaginatedRentalEstates,
  RentalEstateQueryFilters,
} from '@/domain/entities/rental_estate'
import { IRentalEstateRepository } from '@/domain/repositories/rental_estate.repository'

export class GetRentalEstatesUseCase {
  constructor(private rentalEstateRepository: IRentalEstateRepository) {}

  async execute(
    filters?: RentalEstateQueryFilters
  ): Promise<PaginatedRentalEstates> {
    return await this.rentalEstateRepository.getEstates(filters)
  }
}
