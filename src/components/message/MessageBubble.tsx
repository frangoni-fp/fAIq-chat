import { useEffect, useState } from 'react'
import { type CTA, type DeliveryStatus, type MessageRole, type Outcome } from '../../api/types'
import { AgentCTA, CalculatorCTA, MessageIndicator } from './'

function formatTimeHHMM(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

interface MessageBubbleProps {
  content: string
  role: MessageRole
  timestamp: Date
  deliveryStatus?: DeliveryStatus
  outcome?: Outcome
  cta: CTA | null
}

const MessageBubble = ({ content, role, timestamp, deliveryStatus, cta }: MessageBubbleProps) => {
  const [isEntering, setIsEntering] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsEntering(true))
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const bubbleclasses = [
    'message-bubble',
    role === 'user' ? 'message-sent' : 'message-received',
    isEntering ? 'is-entering' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={bubbleclasses}>
      <div className="message-text">{content}</div>
      <div className="message-indicators">
        <time dateTime={timestamp.toISOString()}>{formatTimeHHMM(timestamp)}</time>
        {role === 'user' && <MessageIndicator status={deliveryStatus ?? 'pending'} />}
      </div>
      {cta && cta.action === 'OPEN_WHATSAPP' && <AgentCTA label={cta.label} />}
      {cta && cta.action === 'OPEN_CALCULATOR' && (
        <CalculatorCTA label={cta.label} preselectCountry={cta.preselect_country} />
      )}
    </div>
  )
}

export default MessageBubble
