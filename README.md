# AI Support Chat

This project is a **chat interface built as a [Webflow Code Component](https://developers.webflow.com/code-components)**. You add it in the Webflow Designer like any other component, point it at your API, and it handles the conversation UI in the published site.

It is meant to sit in front of an **AI support or Q&A server**—typically one that answers from a **knowledge base** (for example RAG over docs, FAQs, or internal articles). The component only renders messages; retrieval, models, and business logic live on your server.

## Stack

- React 19 and TypeScript
- Vite 8
- [@webflow/react](https://developers.webflow.com/code-components) and the Webflow CLI for library publishing

## Features

- Message list with auto-scroll
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
- **Body:** `{ "question": "<user message>" }`

Respond with **HTTP 200** and a JSON **object** shaped like `ChatApiResponse` in `src/api/types.ts`. The chat bubble shows **`answer`**; other fields are available for your product (outcomes, CTAs, server-side errors) and can be wired up in the UI later.

| Field | Type | Notes |
|--------|------|--------|
| `outcome` | string | One of: `faq_answer`, `trigger_cta`, `other_cta`, `issue_cta` |
| `answer` | string | **Required for the visible reply** — assistant message text |
| `cta` | object or `null` | Optional: `{ "action": "OPEN_CALCULATOR" \| "OPEN_WHATSAPP", "label": string, "preselect_country": string \| null }` |
| `error` | string or `null` | Optional server-side message (not automatically shown in the chat today unless you use it in the hook) |

Example success body:

```json
{
  "outcome": "faq_answer",
  "answer": "You can reset your password from Account settings → Security.",
  "cta": null,
  "error": null
}
```

Example with a CTA:

```json
{
  "outcome": "trigger_cta",
  "answer": "For a custom quote, open the calculator.",
  "cta": {
    "action": "OPEN_CALCULATOR",
    "label": "Open calculator",
    "preselect_country": "US"
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
