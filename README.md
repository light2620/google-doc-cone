Google Docs — Collaborative Editor

A collaborative rich-text document editor built with modern web tools (Next.js, Liveblocks, Convex). Supports real-time multi-user editing, persistent documents, and a polished UI.

**Live features & highlights**

- Real-time collaborative editing with presence and cursors
- Rich-text editing powered by TipTap / Quill-style editor
- Document persistence and server-side APIs via Convex
- Authentication and user management (Clerk)
- Responsive UI built with Tailwind CSS and shadcn/ui components
- Docker-ready for local full-stack testing

## Tech stack

- Framework: Next.js + React + TypeScript
- Real-time: Liveblocks (presence & collaborative primitives)
- Backend / DB: Convex (serverless backend & data model)
- Auth: Clerk (authentication and user profiles)
- Editor: TipTap (rich-text editing)
- Styling: Tailwind CSS
- Utilities: date-fns, nanoid, clsx, lucide-react

## Quickstart (local)

Prerequisites: Node.js 18+, npm (or pnpm/yarn), Convex CLI, Liveblocks & Clerk accounts for production features.

1. Clone

```bash
git clone <your-repo-url>
cd google-docs
```

2. Install dependencies

```bash
npm install
# or pnpm install
```

3. Environment variables

Create a `.env.local` in the project root and add the following (example keys):

```
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment
NEXT_PUBLIC_CONVEX_URL=https://yourconvex.convex.cloud

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_live_...
LIVEBLOCKS_SECRET_KEY=sk_...

# Clerk (if used)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

4. Start Convex (if developing with Convex backend)

```bash
npx convex dev
# keep this running in its terminal
```

5. Run the app

```bash
npm run dev
# Open http://localhost:3000
```



## Project structure (high level)

- `app/` — Next.js app routes and UI
- `src/` — app source (components, hooks, store)
- `convex/` — Convex backend functions and schema
- `public/` — static assets

## Environment notes

- Convex provides the serverless backend and realtime subscriptions; set `NEXT_PUBLIC_CONVEX_URL` to your Convex deployment.
- Liveblocks requires a server-side auth endpoint (`/api/liveblocks-auth`) and a public key injected into the client.
- Clerk keys are required for auth features (optional if you use another auth provider).

## Scripts

- `npm run dev` — Start Next.js dev server
- `npm run build` — Build for production
- `npm start` — Start production server

## Contributing

Contributions welcome — open issues or PRs. Please run linters and tests (if present) before submitting.

