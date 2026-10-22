# Portfolio — Plan

## 1. The core problem, reframed

> "Most of my work isn't deployed and many repos are private."

That's normal. Senior designers and engineers rarely link to live apps; they show **case studies**. Your strength is *research → design → build end to end*, and a live link can't show that anyway. A screenshot plus a story about the problem, the decision you made, and the result can.

So every project gets one of three "proof levels". None of them is a weakness:

| Proof level | What we show | Projects |
|---|---|---|
| **Live** | "Try it ↗" button, real product | Anyash Voice Health Companion, iOS app |
| **Recorded** | Screenshots + 20–40s screen recording (muted, autoplay loop) | AI learning platform, heavy-server projects |
| **Story** | Screenshots + problem/solution write-up, plus "Private repo, walkthrough on request" | Client / private work |

A short screen recording (record it locally, export as a small `.mp4`/`.webm`) makes a project feel alive without you paying for servers.

---

## 2. Positioning: what you're best at

From what you described, this is your line:

> **Product engineer.** I find the real problem, design the solution, and build it end to end. Frontend is where I live.

Supporting proof (each claim has evidence on the page):
- **Find the problem** → each case study opens with the research and the insight
- **Design it** → screenshots, design taste, Figma/flows where available
- **Build end to end** → stack used, architecture note, live links
- **Trusted by clients** → Fiverr ⭐ 5.0 · 32 reviews
- **Validated ideas** → 2nd place, Google startup program, $20k prize; startup pitches

---

## 3. Information architecture

One sleek home page with everything on it, plus one detail page per project.

```
/                 Home (everything at a glance)
/work/[slug]      Case study per project
/about            (optional, later) longer story
```

### Home page, top to bottom

1. **Header**: small logo/initials · email link · status pill (`● Available for work`)
2. **Hero** (from ref 3): `Hi, I'm [avatar] Name.` / `I research, design & build products end to end.` / short line plus `Book a call` / `Email me`
3. **Link dock** (from ref 2): a row of icon tiles for GitHub, LinkedIn, X, Fiverr, Email, Resume. Hover magnifies them like the macOS dock.
4. **Bento grid** (from ref 3), 4–5 cards:
   - **Now building**: what you're working on right now
   - **Fiverr**: ⭐ 5.0, 32 reviews, 1 short client quote
   - **Award**: 2nd place · Google startup program · $20k
   - **Stack**: icons of the tools you actually use
   - **How I work**: 01 Research → 02 Design → 03 Build → 04 Ship (stepper tabs, like ref 3)
5. **Selected work** (from ref 1's calm label/content layout):
   - Featured: Anyash (live), iOS app (live), with a large screenshot and a "Live ↗" badge
   - Then a list: title · one-line tagline · a strip of 3 thumbnails · tags. Click opens the case study.
6. **Now / Previously** (from ref 1): two-column text rows
   - `Now`: current work / study
   - `Previously`: Fiverr freelancing, projects, startup pitches
   - `Recognition`: Google startup program, pitch events
7. **Footer**: "Let's build something", plus email and socials (ref 2's simple ending)

### Case study template (`/work/[slug]`)

```
Title · tagline · role · year · stack · [Live ↗ | Private repo]
Hero image / video
01 Problem      What was broken, and for whom (the research part)
02 Insight      The one thing that shaped the solution
03 Design       Screens, flows, decisions + why
04 Build        Architecture sketch, interesting technical bit
05 Outcome      Result, users, learnings
Gallery
← Prev  ·  Next →
```

Keep each case study short and scannable: about 300–600 words, heavy on images.

---

## 4. Visual direction: "quiet, editorial, tactile"

A blend of the three references:
- **Ref 1** → calm typography, generous whitespace, label/content rows, underlined links
- **Ref 2** → centered intro, icon dock, soft gray gradient background
- **Ref 3** → bold hero with an inline avatar, bento cards with pill labels, status pill

Design tokens (draft):
- **Background** `#F5F5F4` (warm off-white) · **Cards** `#FFFFFF` with a 1px border and a very soft shadow
- **Text** `#111` primary, `#8A8A8A` secondary (the gray "label" look from ref 1)
- **One accent color**, used sparingly (status dot, link hover, "Live" badges). Candidates: orange `#FF5B1F` or green `#22C55E`.
- **Type**: `Inter` or `Geist` for UI, optionally a display face for the hero (e.g. `Instrument Serif` italic for one word)
- **Radius** 20–24px on cards, pills fully rounded
- **Width**: content column about 720px, bento grid up to about 960px
- **Motion**: subtle only. Fade-up on scroll, dock magnify, card hover lift, stepper tab transitions. Respect `prefers-reduced-motion`.
- **Dark mode**: yes, via tokens from day one

The goal is that it *feels* like a well-designed product, because frontend and design taste are your selling points. The site itself is a portfolio piece.

---

## 5. Tech stack (superseded: we went with Vite + React + Tailwind v4 + Motion, see README)

- **Next.js (App Router) + TypeScript**, which shows the frontend skills you're selling
- **Tailwind CSS** for tokens and fast iteration
- **MDX** for case studies (one file per project in `content/work/`, with frontmatter for metadata)
- **Framer Motion** for the dock, bento, and stepper micro-interactions
- **next/image** for optimized screenshots, plus `<video>` for recordings
- **Vercel** for hosting (free, plus a custom domain)
- Optional: Cal.com link for "Book a call", Vercel Analytics

Project data lives in typed content files, so adding a project means adding one MDX file and dropping its images into a folder.

---

## 6. Content I need from you

**About you**
- [ ] Name, photo (square, good light), one-line title you like
- [ ] Location / timezone (optional), email, GitHub, LinkedIn, X, Fiverr profile URL
- [ ] What you're working on **now** (1–2 lines)
- [ ] Short timeline: education, freelancing period, any jobs or internships
- [ ] Resume PDF (optional)

**Per project** (start with your best 4–6, not everything)
- [ ] Name + one-line tagline
- [ ] Your role, year, stack
- [ ] Problem → insight → what you built → outcome (bullet points are fine, I'll write it up)
- [ ] 3–8 screenshots (full-res PNG), plus a screen recording if possible
- [ ] Live link / App Store link, if any

**Proof**
- [ ] 2–3 best Fiverr review quotes (with client first name / country)
- [ ] Google startup program: program name, year, what the project was, your role
- [ ] Pitch events: names / years (a list is fine)

> On the award: word it honestly and confidently, e.g. *"2nd place, [Program] · $20k. Core builder on the team."* Saying what you built is stronger than claiming the lead.

---

## 7. Build phases

1. **Foundation**: Next.js + Tailwind setup, design tokens, fonts, dark mode, layout shell
2. **Home page**: hero, dock, bento grid, work list, Now/Previously, footer (with placeholder content)
3. **Case study system**: MDX pipeline, template, gallery, video support
4. **Content**: plug in your real text, screenshots, recordings
5. **Polish**: motion, responsive pass (mobile first), accessibility (contrast, keyboard, alt text), SEO and OG images per project
6. **Ship**: Vercel deploy, custom domain, analytics

---

## 8. Open decisions

1. **Accent color**: orange (energetic, like ref 3) or green (calm, "available")?
2. **Tone of the hero**: bold and big (ref 3) or quiet and small (ref 1)? *Recommendation: bold hero, quiet everything else.*
3. **Blog / notes section** later? It would be a good place for "how I researched X" posts and strengthens the "I find real problems" story.
