import { Chat } from './App'
import { props } from '@webflow/data-types'
import { declareComponent } from '@webflow/react'

export default declareComponent(Chat, {
  name: 'AI Support Chat',
  description: 'AI Support Chat',
  options: {
    ssr: false,
  },
  props: {
    apiEndpoint: props.Text({
      name: 'API Endpoint',
      defaultValue: '',
    }),
  },
})
