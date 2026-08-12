import { container } from '@/di/container'
import { RentalEstateQueryFilters } from '@/domain/entities/rental_estate'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useRentalEstateStore } from '../stores/rentalEstateStore'

export const useRentalEstateDetail = (id: string) => {
  const setSelectedEstate = useRentalEstateStore(
    (state) => state.setSelectedEstate
  )

  return useQuery({
    queryKey: ['rental-estate', id],
    queryFn: async () => {
      const data = await container.getRentalEstateByIdUseCase.execute(id)
      setSelectedEstate(data)
      return data
    },
    enabled: !!id,
  })
}

export const useRentalEstates = (filters: RentalEstateQueryFilters) => {
  return useQuery({
    queryKey: ['rental-estates', filters],
    queryFn: async () => {
      const data = await container.getRentalEstatesUseCase.execute(filters)
      return data
    },
    placeholderData: keepPreviousData,
  })
}
