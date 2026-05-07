import type { ChatApiError, ChatApiResponse } from './types'

interface SendChatMessageParams {
  endpoint: string
  question: string
  sessionId: string
  signal?: AbortSignal
}

export async function sendChatMessage({
  endpoint,
  question,
  sessionId,
  signal,
}: SendChatMessageParams): Promise<{ response: ChatApiResponse }> {
  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, session_id: sessionId }),
      signal,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed'
    throw { type: 'network' as const, message } satisfies ChatApiError
  }

  if (!response.ok) {
    let errorBody: string | undefined
    try {
      errorBody = await response.text()
    } catch {
      // ignore
    }
    const message = errorBody || `Request failed with status ${response.status}`
    throw {
      type: 'http' as const,
      status: response.status,
      message,
    } satisfies ChatApiError
  }

  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw {
      type: 'parse' as const,
      message: 'Invalid JSON in API response',
    } satisfies ChatApiError
  }

  if (data === null || typeof data !== 'object') {
    throw {
      type: 'parse' as const,
      message: 'API response must be an object',
    } satisfies ChatApiError
  }

  const obj = data as ChatApiResponse

  return { response: obj }
}
