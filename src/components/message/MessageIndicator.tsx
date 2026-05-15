import { type DeliveryStatus } from '../../api/types'
import CHAT_ICONS from '../_icons'

interface MessageIndicatorProps {
  status: DeliveryStatus
}

const MessageIndicator = ({ status }: MessageIndicatorProps) => {
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

export default MessageIndicator
