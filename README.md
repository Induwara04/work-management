# Work Management

Single-user work management app built with React, Vite, TypeScript, Material UI, Recharts, and Supabase.

## Features

- Dashboard with today, overdue, high-priority, and release-focused work sections
- Task CRUD with filters, search, priority/status/category/project fields, and quick add
- Calendar / timeline view grouped by date
- Analytics with Recharts bar, pie, and line charts
- Browser notifications plus in-app notification center
- Notes area linked to tasks
- AI Work Assistant placeholder fed by live task data
- Light mode and dark mode
- Supabase-ready services and SQL schema
- Local fallback mode using `localStorage` when Supabase is not configured yet

## Stack

- React + Vite
- TypeScript
- Material UI
- Recharts
- Supabase JS client
- React Router
- date-fns
- notistack

## Project Structure

```text
src/
  components/
  data/
  hooks/
  pages/
  services/
  theme/
  types/
  utils/
supabase/
  schema.sql
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and add your Supabase values:

```bash
cp .env.example .env
```

3. Start the app:

```bash
npm run dev
```

If you leave the Supabase variables empty, the app still runs in demo mode using seeded `localStorage` data.

## Supabase Setup

1. Create a new Supabase project.
2. Open the SQL Editor in Supabase.
3. Run the SQL in [supabase/schema.sql](/Users/dilanin/work-mang/work-management/supabase/schema.sql).
4. Copy your project URL and anon key into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Restart `npm run dev`.

## Notes About Security

The current schema is optimized for a personal single-user app and does not add auth or RLS policies. For a private production deployment, add Supabase Auth and row-level security before exposing the project publicly.
