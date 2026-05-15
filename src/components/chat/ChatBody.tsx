import React from 'react'
import { MessageBubble } from '../message'
import type { ChatMessage } from '../../api/types'

interface ChatBodyProps {
  messages: ChatMessage[]
  error: string | null
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
}

const ChatBody = ({ messages, error, messagesContainerRef }: ChatBodyProps) => {
  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.answer}
          role={msg.role}
          timestamp={msg.timestamp}
          deliveryStatus={msg.deliveryStatus}
          outcome={msg.outcome}
          cta={msg.cta}
        />
      ))}
      {error && (
        <div className="message-error" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default ChatBody
