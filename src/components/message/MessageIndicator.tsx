import { type DeliveryStatus } from '../../api/useChatApi'
import CHAT_ICONS from '../_icons'

interface MessageIndicatorProps {
  status: DeliveryStatus
}

export default function MessageIndicator({ status }: MessageIndicatorProps) {
  const isActive = status === 'delivered'
  const showClock = status === 'pending'
  const showTick = status === 'sent' || status === 'delivered'

  return (
    <div className={`message-indicator_embed${isActive ? ' is-active' : ''}`}>
      {showClock && CHAT_ICONS.clock}
      {showTick && CHAT_ICONS.tick}
    </div>
  )
}
