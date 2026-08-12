import { container } from '@/di/container'
import RentalEstateId from '@/presentation/clients/RentalEstateId'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import RentalDetailLoading from './loading'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function RentalEstateDetailPage({ params }: PageProps) {
  const { id } = await params

  return (
    <Suspense fallback={<RentalDetailLoading />}>
      <RentalEstateDetailData id={id} />
    </Suspense>
  )
}

async function RentalEstateDetailData({ id }: { id: string }) {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['rental-estate', id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return await container.getRentalEstateByIdUseCase.execute(id)
    },
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RentalEstateId id={id} />
    </HydrationBoundary>
  )
}
