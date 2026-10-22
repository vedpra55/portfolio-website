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

## Small gestures

- Avatar: hover to wave, drag and it springs back
- Hero line rotates: *finds the real problem → designs the fix → ships it end to end*
- Copy email button morphs to "Copied"
- macOS-style dock that magnifies on hover
- Project cards expand into the case study (shared-element transition), deep-linkable as `#work/<id>`; Esc / drag-handle / backdrop to close
- `⌘K` / `Ctrl K` command menu
- Count-ups, a stepper that auto-advances (pauses on hover), a stack marquee, a pointer-follow glow on cards
- Local-time-aware footer ("I'm asleep, I'll reply in the morning")
- Light/dark with no flash; respects reduced motion

Deploy: any static host (Vercel, Netlify, Cloudflare Pages). Build command `npm run build`, output `dist`.
