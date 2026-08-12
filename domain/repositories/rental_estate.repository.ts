import {
  PaginatedRentalEstates,
  RentalEstate,
  RentalEstateQueryFilters,
} from '@/domain/entities/rental_estate'

export interface IRentalEstateRepository {
  getRentalEstateById(id: string): Promise<RentalEstate>
  getEstates(params?: RentalEstateQueryFilters): Promise<PaginatedRentalEstates>
}
