import { useCallback, useState } from 'react'
import CHAT_ICONS from '../_icons'

interface ChatBottomProps {
  onSend: (text: string) => void
  disabled?: boolean
}

const ChatBottom = ({ onSend, disabled = false }: ChatBottomProps) => {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setInputValue('')
  }, [inputValue, onSend, disabled])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div className={`chat-bottom ${disabled ? 'chat-bottom--disabled' : ''}`}>
      {/*  <div className="icon-small">{CHAT_ICONS.plus}</div> */}
      <div className="chat-input">
        <div className="icon-small">{CHAT_ICONS.emoji}</div>
        <input
          type="text"
          className="chat-input__field"
          placeholder="Escribe un mensaje..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-busy={disabled}
          aria-label="Mensaje"
        />
        <div className="icon-small">{CHAT_ICONS.clip}</div>
        <div className="icon-small">{CHAT_ICONS.camera}</div>
      </div>
      <button
        type="button"
        className="chat-send"
        onClick={handleSubmit}
        disabled={disabled || !inputValue.trim()}
        aria-label="Enviar mensaje"
      >
        <div className="icon-small">{CHAT_ICONS.send}</div>
      </button>
    </div>
  )
}

export default ChatBottom
