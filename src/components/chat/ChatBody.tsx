import React from 'react'
import { MessageBubble } from '../message/MessageBubble'
import type { ChatMessage } from '../../api/useChatApi'

interface ChatBodyProps {
  messages: ChatMessage[]
  error: string | null
  messagesContainerRef: React.RefObject<HTMLDivElement | null>
}

export default function ChatBody({ messages, error, messagesContainerRef }: ChatBodyProps) {
  return (
    <div className="chat-messages" ref={messagesContainerRef}>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          content={msg.content}
          role={msg.role}
          timestamp={msg.timestamp}
          deliveryStatus={msg.deliveryStatus}
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
