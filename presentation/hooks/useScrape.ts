import { container } from '@/di/container'
import { ScrappingEstateRequest } from '@/domain/entities/scraper'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'

export function useScraper() {
  const [message, setMessage] = useState<string>('')

  const scrappingMutation = useMutation({
    mutationFn: async (req: ScrappingEstateRequest) => {
      const { message } = await container.scrappingEstateUsecase.execute(req)
      return { message }
    },
    onSuccess: ({ message }) => {
      setMessage(message)
      toast.info(`Successful ${message}`)
    },
    onError: (err) => {
      toast.error(`${err}`)
    },
  })

  return {
    message,
    scrappingEstate: scrappingMutation.mutateAsync,
    isAnswerLoading: scrappingMutation.isPending,
  }
}
