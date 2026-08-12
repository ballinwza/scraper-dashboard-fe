import {
  RentalEstatePaginatedResponseDTO,
  RentalEstateResponseDTO,
} from '@/application/dto/rental_estate.dto'
import {
  PaginatedRentalEstates,
  RentalEstate,
} from '@/domain/entities/rental_estate'

export class RentalEstateMapper {
  static toDomain(dto: RentalEstateResponseDTO): RentalEstate {
    return {
      ...dto,
    }
  }

  static toPaginatedDomain(
    dto: RentalEstatePaginatedResponseDTO
  ): PaginatedRentalEstates {
    return {
      items: dto.data.map((item) => this.toDomain(item)),
      total: dto.pagination.total_items,
      page: dto.pagination.current_page,
      limit: dto.pagination.limit,
      totalPages: dto.pagination.total_pages,
    }
  }
}
