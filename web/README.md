# Usof frontend

This is the React frontend for Usof. It uses Redux Toolkit and RTK Query for API requests, React Router for pages, and xp.css for the Windows XP style.

Users can ask questions, write replies, react, save favorites and edit their profiles. The main feed and profile pages have filters, sorting and pagination. Admins can manage users and content at `/manage`.

Clip, Scout, Wisp and Byte appear around the site. The home tip changes its character and message when you click it. The other characters are static illustrations.

## Run

Follow the [setup instructions](../README.md), then run the API and frontend in separate terminals from the repository root:

```bash
npm run dev:api
```

```bash
npm run dev:web
```

## Build

```bash
npm run build
```

The result is in `web/dist`.

[CBL progress and program algorithm](docs/cbl.md)
