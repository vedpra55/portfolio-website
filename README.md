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
One typeface (Host Grotesk, self-hosted), one size, hierarchy through ink vs. grey. No accent colour.

## Small gestures

- Hover (or tap) the avatar: it opens into a larger photo showing my local time and whether I'm likely awake
- Email row copies on click; the address rolls over to "Copied to clipboard"
- Link rows nudge and show ↗ on hover, all on one aligned grid
- Tabs: sliding underline, directional transition, ← / → keys, state kept in the URL (`#info`, `#work/anyash`)
- Project scenes rest on their finished frame and replay from the start on hover (they play on scroll on touch screens)
- The thumbnail grows into the case-study sheet; Esc, backdrop, or drag the handle down to close
- Blinking clock colon, Light/Dark toggle whose label rolls, `⌘K` / `Ctrl K` command menu
- Respects reduced motion

Deploy: any static host (Vercel, Netlify, Cloudflare Pages). Build command `npm run build`, output `dist`.
