# AI Support Chat

This project is a **chat interface built as a [Webflow Code Component](https://developers.webflow.com/code-components)**. You add it in the Webflow Designer like any other component, point it at your API, and it handles the conversation UI in the published site.

It is meant to sit in front of an **AI support or Q&A server**—typically one that answers from a **knowledge base** (for example RAG over docs, FAQs, or internal articles). The component only renders messages; retrieval, models, and business logic live on your server.

## Stack

- React 19 and TypeScript
- Vite 8
- [@webflow/react](https://developers.webflow.com/code-components) and the Webflow CLI for library publishing

## Features

- Message list with auto-scroll
- Conversational **`session_id`**: the client sends an empty id on the first message, stores `session_id` from the API response, and includes it on later messages (see **Backend contract**)
- Send state, delivery-style status on the user bubble, and inline error display when the API fails
- Optional sound on send (hosted asset referenced in `App.tsx`)
- Webflow Designer prop: **API Endpoint** (`apiEndpoint`) — the component does not send requests until this URL is set (trimmed non-empty string)

## Prerequisites

- Node.js 20+ recommended
- npm (or compatible package manager)

## Local development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The Vite entry in `src/index.tsx` mounts `<Chat apiEndpoint="http://localhost:3000/api/chat" />`. Change that URL to match your local API, or point it at a deployed endpoint.

## Backend contract

The client calls your AI / knowledge-base API with:

- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:** `{ "question": "<user message>", "session_id": "<session id>" }`

**Session flow**

- The **first** message in a conversation is sent with `session_id` as an **empty string** (`""`). Your server should create a session, include a **new** `session_id` in the JSON response, and use it to correlate later turns (memory, tools, or billing).
- **Every subsequent** request from the client repeats the **`session_id` value from the last successful assistant response**. Your API must accept that id and treat it as the same conversation.

Respond with **HTTP 200** and a JSON **object** shaped like `ChatApiResponse` in `src/api/types.ts`. The chat bubble shows **`answer`**; other fields drive CTAs, outcomes, and optional server-side messages.

| Field | Direction | Type | Notes |
|--------|-----------|------|--------|
| `question` | Request | string | The user’s latest message |
| `session_id` | Request | string | Empty on first message; afterwards, copy from the previous response’s `session_id` |
| `session_id` | Response | string | Stable id for this conversation; returned on every assistant reply |
| `outcome` | Response | string | One of: `faq_answer`, `trigger_cta`, `other_cta`, `issue_cta`, `user_message` |
| `answer` | Response | string | **Required for the visible reply** — assistant message text |
| `cta` | Response | object or `null` | `{ "action": "OPEN_CALCULATOR" \| "OPEN_WHATSAPP", "label": string, "preselect_country": string \| null }` |
| `error` | Response | string or `null` | Optional server-side message (not automatically shown in the chat UI unless you wire it) |

Example request (first message in the thread — note empty `session_id`):

```json
{
  "question": "¿Cómo puedo mandar plata a México?",
  "session_id": ""
}
```

Example response:

```json
{
  "session_id": "sess_01k9abcdexample",
  "outcome": "faq_answer",
  "answer": "Para enviar dinero a México puedes usar la app o la web: elige destino México, monto y método de pago. Si querés, decime desde qué país enviás y te indico tarifas y tiempos.",
  "cta": null,
  "error": null
}
```

Example request **follow-up** in the same conversation (reuse `session_id` from the previous response):

```json
{
  "question": "¿Cuánto tarda en llegar?",
  "session_id": "sess_01k9abcdexample"
}
```

Example response with a CTA:

```json
{
  "session_id": "sess_01k9abcdexample",
  "outcome": "trigger_cta",
  "answer": "Para tu caso conviene cotizar el envío con la calculadora y elegir México como destino.",
  "cta": {
    "action": "OPEN_CALCULATOR",
    "label": "Abrir calculadora",
    "preselect_country": "MX"
  },
  "error": null
}
```

The UI surfaces failures for **network errors**, **non-OK HTTP status**, **invalid JSON**, or **responses that are not a JSON object**. Shape mismatches (for example missing `answer`) are not validated in `fetch`; keep your API aligned with the type above so the client can render `response.answer` reliably.

## Webflow Code Component

This is the primary delivery: a Code Component you install from a Webflow component library and place on pages in the Designer.

- Component definition: `src/App.webflow.tsx` (name: **AI Support Chat**)
- Library metadata: `webflow.json` (library id: `ai-support-chat`)
- Global styles for the bundle: `src/globals.ts` (imports `globals.css`)

### Useful npm scripts

| Script | Purpose |
|--------|---------|
| `npm run webflow:bundle` | Produce a dev bundle with `webflow library bundle` (public path `http://localhost:4000/`) |
| `npm run webflow:share` | Publish the component library to Webflow (`webflow library share`) |

Run `npx webflow library share --help` for authentication and workspace options.

## Project layout

```
src/
  App.tsx              # Chat layout and composition
  App.webflow.tsx      # Webflow `declareComponent` wrapper and props
  index.tsx            # Vite dev root (local `apiEndpoint` for testing)
  globals.css          # Styles
  api/
    types.ts           # Messages, API errors, and `ChatApiResponse` shape
    useChatApi.ts      # `POST` + JSON body / response handling
  hooks/
    useChat.tsx        # Message state, send handler, scroll, audio
  components/
    chat/              # Header, body, bottom input
    message/           # Bubbles and indicators
```

## Quality checks

```bash
npm run lint
npm run build
```

## License

Private project (`"private": true` in `package.json`). Add a license file if you intend to distribute the code.
