const WHATSAPP_AGENT_MESSAGE = 'Hola Félix! Quisiera hablar con un agente'
const WHATSAPP_PHONE_NUMBER = '+16693333549'

const buildWhatsAppHref = (phone: string) => `https://wa.me/${phone}?text=${encodeURIComponent(WHATSAPP_AGENT_MESSAGE)}`

export interface AgentCTAProps {
  label: string
}

export function AgentCTA({ label }: AgentCTAProps) {
  const href = buildWhatsAppHref(WHATSAPP_PHONE_NUMBER.replace('+', ''))

  return (
    <a className="agent-cta" href={href} target="_blank" rel="noopener noreferrer">
      {label}
    </a>
  )
}
