export type MessageRole = 'user' | 'assistant'
export type DeliveryStatus = 'pending' | 'sent' | 'delivered'

export interface ChatMessage {
  id: string
  content: string
  role: MessageRole
  timestamp: Date
  deliveryStatus?: DeliveryStatus
}

export type ChatApiError =
  | { type: 'network'; message: string }
  | { type: 'http'; status: number; message: string }
  | { type: 'parse'; message: string }
  | { type: 'unknown'; message: string }

type Outcome = 'faq_answer' | 'trigger_cta' | 'other_cta' | 'issue_cta'
type Action = 'OPEN_CALCULATOR' | 'OPEN_WHATSAPP'

export interface ChatApiResponse {
  outcome: Outcome
  answer: string
  cta: { action: Action; label: string; preselect_country: string | null } | null
  error: string | null
}
