import { container } from '@/di/container'
import { RentalEstateQueryFilters } from '@/domain/entities/rental_estate'
import { RentalEstateClient } from '@/presentation/clients/RentalEstatesClient'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import RentalDetailLoading from './loading'

const initialFilters: RentalEstateQueryFilters = {
  page: 1,
  limit: 10,
  search: '',
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: 'created_at',
  order: 'desc',
}

export default async function RentalEstatesPage() {
  return (
    <Suspense fallback={<RentalDetailLoading />}>
      <RentalEstates />
    </Suspense>
  )
}

async function RentalEstates() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['rental-estates', initialFilters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return await container.getRentalEstatesUseCase.execute(initialFilters)
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RentalEstateClient />
    </HydrationBoundary>
  )
}
