import type { ChatApiError, ChatApiResponse } from './types'

interface SendChatMessageParams {
  endpoint: string
  question: string
  sessionId: string
  signal?: AbortSignal
}
const TEMP_TOKEN =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgwNzZkZGJhYjQxNTU1NmUxNjkxNTRjNmE0YTBiZGJkNDQ2OWI3OWMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwczovL2N1ZXJuYXZhY2Euc2FuZGJveC5mcGFnby5jb20iLCJhenAiOiIxMTM1NDI1MDc1OTI2NjYxNTUyOTkiLCJlbWFpbCI6ImN1ZXJuYXZhY2Etc2FAZmVsaXgtc2FuZGJveC1na2UuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzc4MTY3Nzc5LCJpYXQiOjE3NzgxNjQxNzksImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsInN1YiI6IjExMzU0MjUwNzU5MjY2NjE1NTI5OSJ9.LzBjGBjzCvAyKX9n9gMOL2uLhp2ZKb2Cr23FfoUAgKu_wKlD3iXAyM7IN8y7YqzpLFaP92Bg16JU5U9iAFlX8TtW-9Msaxfcc3pc8hCem7UFLKju4QVvAPpqky26XDyEGTAG99rNTVSR6JbtcRc0QPSfSfLc_pJLM9pQsf4uv5xAAEJpzDEM27oE8Erp6XrYX8Su-yxOor7ZATz-AT6bIf7x-DrOE0v0GXqDBJtFhQwFSiXllbtHF6bLUBRDZtsreVpNstTeRfEGKGb46qODUPoqpQDHLHNqit6xFCgr6MHFdsmtk9-w0w9xj21Gy9j6AabdQADy1-VPsb4_OrN0tA'

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
        Authorization: `Bearer ${TEMP_TOKEN}`,
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
