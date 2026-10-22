# Ved Pratap Singh — portfolio

Vite + React + TypeScript + Tailwind v4 + Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Editing content

Everything lives in `src/data.ts`: profile, links, projects, proof, how-I-work steps, stack.

- **Email:** set `profile.email` (it's a placeholder right now).
- **Live links:** set `href` on Anyash and Have.
- **Project previews:** each project has an animated mini-scene in `src/components/Previews.tsx`.
  These stand in for screenshots. Swap one for an `<img>` or `<video>` when you have real media.

## Design

Quiet, app-like, two panes: profile fixed on the left, Work / Info tabs on the right.
Each project has its own page at `/work/<id>` (Overview, Problem, What I found, How it works, Decisions, Outcome, Stack, Screens).
Sections with no data (metrics, screenshots) hide themselves. Put screenshots in `public/work/<id>/`.
One typeface (Host Grotesk, self-hosted), one size, hierarchy through ink vs. grey. No accent colour.

## Small gestures

- On load the left pane settles in line by line and a thin green ring draws once around the photo; hovering the photo redraws it and rolls the role line to my local time
- Icon row for links; hovering names each one underneath, the envelope copies the email
- Tabs: sliding underline, directional transition, ← / → keys, real URLs (`/`, `/info`, `/work/anyash`)
- Project scenes rest on their finished frame and replay from the start on hover (they play on scroll on touch screens)
- Page changes use the View Transitions API: only the clicked thumbnail morphs between the list and the project page header (also for "Next project" and the browser back button), the rest crossfades. The list keeps its scroll position. Esc goes back, [ and ] flip projects
- Blinking clock colon, Light/Dark toggle whose label rolls, `⌘K` / `Ctrl K` command menu
- Respects reduced motion

Deploy: any static host (Vercel, Netlify, Cloudflare Pages). Build command `npm run build`, output `dist`.

SPA fallback is configured for Vercel (`vercel.json`) and Netlify (`public/_redirects`).
