'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { container } from '../../di/container'

export function useChatbot() {
  const [answer, setAnswer] = useState<string>('')

  const chatbotAnswerMutation = useMutation({
    mutationFn: async (question: string) => {
      const { message } = await container.chatbotAnswerUsecase.execute(question)
      return { answer: message }
    },
    onSuccess: ({ answer }) => {
      setAnswer(answer)
    },
    onError: (err) => {
      toast.error(`Something error on chatbot api.`)
    },
  })

  return {
    answer,
    chatbotanswer: chatbotAnswerMutation.mutateAsync,
    isAnswerLoading: chatbotAnswerMutation.isPending,
  }
}
