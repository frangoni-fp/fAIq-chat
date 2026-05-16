import './globals.css'
import useChat from './hooks/useChat'
import { ChatHeader, ChatBody, ChatBottom } from './components/chat'

interface ChatProps {
  apiEndpoint: string
}

export const Chat = ({ apiEndpoint }: ChatProps) => {
  const { messages, isLoading, error, handleSend, messagesContainerRef, audioRef, audioReceivedRef, isEndpointValid } =
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
      <audio
        ref={audioReceivedRef}
        src="https://cdn.prod.website-files.com/663a7abd629bfe97ec950c50/6a0850f44d8b09199917fa6f_wp-receive.mp3"
        preload="auto"
      />
    </div>
  )
}
