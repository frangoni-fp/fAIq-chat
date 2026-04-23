export type MessageRole = 'user' | 'assistant'
export type DeliveryStatus = 'pending' | 'sent' | 'delivered'

export interface ChatMessage extends ChatApiResponse {
  id: string
  deliveryStatus?: DeliveryStatus
  role: MessageRole
  timestamp: Date
}

export type ChatApiError =
  | { type: 'network'; message: string }
  | { type: 'http'; status: number; message: string }
  | { type: 'parse'; message: string }
  | { type: 'unknown'; message: string }

export type Outcome = 'faq_answer' | 'trigger_cta' | 'other_cta' | 'issue_cta' | 'user_message'
export type Action = 'OPEN_CALCULATOR' | 'OPEN_WHATSAPP'

export interface CTA {
  action: Action
  label: string
  preselect_country: string | null
}
export interface ChatApiResponse {
  outcome: Outcome
  answer: string
  cta: CTA | null
  error: string | null
}
