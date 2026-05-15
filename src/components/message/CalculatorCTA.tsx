import { useEffect, useRef } from 'react'

interface CalculatorCTAProps {
  label: string
  preselectCountry?: string
}

const mapCountryToCode: Record<string, string> = {
  colombia: 'co',
  mexico: 'mx',
  perú: 'pe',
  ecuador: 'ec',
  nicaragua: 'ni',
  honduras: 'hn',
  'el salvador': 'sv',
  guatemala: 'gt',
  'república dominicana': 'do',
}

const DEFAULT_COUNTRY_CODE = 'mx'

const CalculatorCTA = ({ label, preselectCountry }: CalculatorCTAProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>('[fs-modal-element="open"]')
    const button = buttonRef.current
    if (!trigger || !button) return

    const normalizedCountry = preselectCountry?.toLowerCase()
    const code = (normalizedCountry && mapCountryToCode[normalizedCountry]) || DEFAULT_COUNTRY_CODE
    trigger.dataset.openModal = code
    window.dispatchEvent(new CustomEvent('felix-country-changed', { detail: { country: code } }))

    const handleClick = () => trigger.click()
    button.addEventListener('click', handleClick)
    return () => button.removeEventListener('click', handleClick)
  }, [preselectCountry])

  return (
    <button ref={buttonRef} type="button" className="cta-button">
      {label}
    </button>
  )
}

export default CalculatorCTA
