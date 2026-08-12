import { RentalEstate } from '@/domain/entities/rental_estate'
import { IRentalEstateRepository } from '@/domain/repositories/rental_estate.repository'

export class GetRentalEstateById {
  constructor(private repository: IRentalEstateRepository) {}

  async execute(id: string): Promise<RentalEstate> {
    return this.repository.getRentalEstateById(id)
  }
}
