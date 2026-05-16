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
  const audioReceivedRef = useRef<HTMLAudioElement | null>(null)
  const [sessionId, setSessionId] = useState<string>('')

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

      if (!trimmed || isLoading || !isEndpointValid) return

      audioRef.current?.play()?.catch(() => {})

      setError(null)

      const userMessage: ChatMessage = {
        id: generateId(),
        answer: trimmed,
        role: 'user',
        timestamp: new Date(),
        deliveryStatus: 'pending',
        outcome: 'user_message',
        cta: null,
        error: null,
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

        const { response } = await sendChatMessage({
          endpoint: apiEndpoint,
          question: trimmed,
          signal: abortRef.current.signal,
          sessionId,
        })

        setMessages((prev) =>
          prev.map((m) => (m.id === userMessage.id ? { ...m, deliveryStatus: 'delivered' as const } : m)),
        )
        setSessionId(response.session_id)

        const assistantMessage: ChatMessage = {
          id: generateId(),
          answer: response.answer,
          role: 'assistant',
          timestamp: new Date(),
          outcome: response.outcome,
          cta: response.cta,
          error: response.error,
        }
        setMessages((prev) => [...prev, assistantMessage])
        audioReceivedRef.current?.play()?.catch(() => {})
      } catch (err) {
        //review error handling for production
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

  return { messages, error, isLoading, handleSend, messagesContainerRef, audioRef, audioReceivedRef, isEndpointValid }
}

export type UseChatReturn = ReturnType<typeof useChat>
