import ChatBody from './components/chat/ChatBody'
import { ChatBottom } from './components/chat/ChatBottom'
import { ChatHeader } from './components/chat/ChatHeader'
import './globals.css'
import useChat from './hooks/useChat'

interface ChatProps {
  apiEndpoint: string
}

export const Chat = ({ apiEndpoint }: ChatProps) => {
  const { messages, isLoading, error, handleSend, messagesContainerRef, audioRef, isEndpointValid } =
    useChat(apiEndpoint)

  return (
    <div className="chat-container">
      <ChatHeader isLoading={isLoading} />
      <ChatBody messages={messages} error={error} messagesContainerRef={messagesContainerRef} />
      <ChatBottom onSend={handleSend} disabled={isLoading || !isEndpointValid} />
      <audio
        ref={audioRef}
        src="https://cdn.prod.website-files.com/663a7abd629bfe97ec950c50/69397d82f56458b7d340c2ca_sent.mp3"
        preload="auto"
      />
    </div>
  )
}
