# Usof

Usof is a programming question-and-answer StackOverflow-like community built with an Express and MySQL API and a React web interface with a Windows XP-inspired visual style.

## Requirements

- Node.js 22.12 or newer
- npm 10 or newer
- MySQL 8.0.16 or newer

## Local development

From the repository root, install dependencies and copy the API environment example:

```bash
npm install
cp api/.env.example api/.env
```

Set the local MySQL credentials and a private `AUTH_SECRET` of at least 32 characters in `api/.env`, then initialize the configured database:

```bash
npm run db:init
```

Run the API and web app in separate terminals:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Open the Vite URL printed by the web development server. The API and avatar requests are proxied by Vite; AdminJS remains at the API origin under `/admin`.

The Vite proxy targets `http://localhost:3000` by default. To use another API origin, copy `web/.env.example` to `web/.env` and change `VITE_API_URL`.

The API uses `MAIL_MODE=file` by default for local development. Confirmation and password reset messages are saved to a private local outbox and are not sent by email.
