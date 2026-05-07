import React from 'react'
import ReactDOM from 'react-dom/client'
import { Chat } from './App'
import './globals.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Chat apiEndpoint="https://growth-hub-288723613852.us-central1.run.app/api/v1/faqs/question" />
  </React.StrictMode>,
)
