import {
  RentalEstatePaginatedResponseDTO,
  RentalEstateQueryParamsDTO,
  RentalEstateResponseDTO,
} from '@/application/dto/rental_estate.dto'
import {
  PaginatedRentalEstates,
  RentalEstate,
  RentalEstateQueryFilters,
} from '@/domain/entities/rental_estate'
import { IRentalEstateRepository } from '@/domain/repositories/rental_estate.repository'
import { axiosClient } from '../api/axios_client'
import { RentalEstateMapper } from '../mappers/rental_estate.mapper'

export class RentalEstateRepositoryImpl implements IRentalEstateRepository {
  async getRentalEstateById(id: string): Promise<RentalEstate> {
    const response = await axiosClient.get<RentalEstateResponseDTO>(
      `/rental/estate/${id}`
    )
    return RentalEstateMapper.toDomain(response.data)
  }

  async getEstates(
    filters?: RentalEstateQueryFilters
  ): Promise<PaginatedRentalEstates> {
    const params: RentalEstateQueryParamsDTO = {
      page: filters?.page,
      limit: filters?.limit,
      search: filters?.search,
      min_price: filters?.minPrice,
      max_price: filters?.maxPrice,
      sort_by: filters?.sortBy,
      order: filters?.order,
    }

    const response = await axiosClient.get<RentalEstatePaginatedResponseDTO>(
      `/rental/estates`,
      { params }
    )

    return RentalEstateMapper.toPaginatedDomain(response.data)
  }
}
