# tiny mchwa web 🐜

Frontend for tiny mchwa — todo list microservice.

## Tech Stack

- React 19
- DaisyUI 5 (Tailwind CSS)
- Vite
- Bun

## Quick Start

```bash
bun install
bun run dev
```

Opens at `http://localhost:5173`. API requests proxy to `http://localhost:3000`.

## Project Structure

```
src/
├── api/client.ts          ← API client (fetch wrapper)
├── types/api.ts           ← TypeScript types (mirrors backend)
├── components/
│   ├── StatusBadge.tsx    ← Status badge (pending/inprogress/done)
│   ├── TodolistCard.tsx   ← Todolist card component
│   └── TaskItem.tsx       ← Task row component
├── pages/
│   ├── TodolistsPage.tsx  ← List + create/edit/delete todolists
│   └── TodolistDetailPage.tsx ← View tasks, create/edit/delete tasks
├── App.tsx                ← Router
└── main.tsx               ← Entry point
```

## Scripts

```bash
bun run dev      # Dev server with hot reload
bun run build    # Production build
bun run preview  # Preview production build
```
