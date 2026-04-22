import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../api/useChatApi'
import type { ChatMessage, ChatApiError } from '../api/types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function useChat(apiEndpoint: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const scrollToBottom = useCallback(() => {
    const el = messagesContainerRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [])

  useLayoutEffect(() => scrollToBottom(), [messages])

  const isEndpointValid = Boolean(apiEndpoint?.trim())

  const handleSend = useCallback(
    async (text: string) => {
      const trimmed = text.trim()

      if (trimmed === '/gabidance') {
        const content = (
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWU0a3hmYm8zNWUyb2RrNnRvd2U0anBwYTcyeWp4Nnd0dWNyanF5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/m1DsyusMWM7uYhMMH5/giphy.gif"
            alt="Gabidance"
          />
        ) as unknown as string
        setMessages((prev) => [
          ...prev,
          {
            id: generateId(),
            content,
            role: 'assistant',
            timestamp: new Date(),
          },
        ])
        return
      }

      if (!trimmed || isLoading || !isEndpointValid) return

      audioRef.current?.play()?.catch(() => {})

      setError(null)

      const userMessage: ChatMessage = {
        id: generateId(),
        content: trimmed,
        role: 'user',
        timestamp: new Date(),
        deliveryStatus: 'pending',
      }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      abortRef.current?.abort()
      abortRef.current = new AbortController()

      try {
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m.id === userMessage.id ? { ...m, deliveryStatus: 'sent' as const } : m)),
          )
        }, 500)

        const { response } = await sendChatMessage(apiEndpoint, trimmed, abortRef.current.signal)

        setMessages((prev) =>
          prev.map((m) => (m.id === userMessage.id ? { ...m, deliveryStatus: 'delivered' as const } : m)),
        )

        const assistantMessage: ChatMessage = {
          id: generateId(),
          content: response.answer,
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        const apiError = err as ChatApiError
        const message =
          apiError.type === 'network'
            ? apiError.message
            : apiError.type === 'http'
            ? `Error ${apiError.status}: ${apiError.message}`
            : apiError.message
        setError(message)
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [apiEndpoint, isLoading, isEndpointValid],
  )

  return { messages, error, isLoading, handleSend, messagesContainerRef, audioRef, isEndpointValid }
}

export type UseChatReturn = ReturnType<typeof useChat>
