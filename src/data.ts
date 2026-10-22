// All site content lives here. Edit this file to update the portfolio.
// Anything marked TODO is waiting on real details: numbers, links, screenshots.

export const profile = {
  name: 'Ved Pratap Singh',
  first: 'Ved',
  role: 'Product engineer',
  bio: 'I research the real problem, design the fix, and build it end to end. Frontend is where I’m happiest.',
  email: 'vedna400@gmail.com',
  photo: '/img/ved.jpg',
  timeZone: 'Asia/Kolkata',
  place: 'India',
  updated: 'October 2026',
}

export type LinkId = 'github' | 'linkedin' | 'x' | 'fiverr' | 'email'

export const links: { id: LinkId; label: string; handle: string; href: string }[] = [
  { id: 'github', label: 'GitHub', handle: 'vedpra55', href: 'https://github.com/vedpra55' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'ved-pratap-singh', href: 'https://www.linkedin.com/in/ved-pratap-singh/' },
  { id: 'x', label: 'X', handle: '@vedthinks', href: 'https://x.com/vedthinks' },
  { id: 'fiverr', label: 'Fiverr', handle: '5.0 · 32 reviews', href: 'https://www.fiverr.com/s/7jjg0qa' },
]

export type Project = {
  id: 'anyash' | 'have' | 'easily' | 'learn'
  name: string
  tagline: string
  kind: string
  year: string
  role: string
  team: string
  stack: string[]
  status: 'live' | 'private'
  /** Live site / App Store link. TODO: add the real ones. */
  href?: string
  hrefLabel?: string
  /** One paragraph: what it is, in plain words. */
  overview: string
  problem: string
  /** What research turned up. DRAFTS: replace with what you actually heard from people. */
  findings: string[]
  /** How the product works, step by step. */
  flow: { title: string; text: string }[]
  /** Design / engineering calls and the reason behind each. */
  decisions: { title: string; why: string }[]
  /** Hard numbers. Leave empty until real ones exist; the section hides itself. */
  metrics: { value: string; label: string }[]
  outcome: string
  next?: string
  /** Screenshots in /public/work/<id>/. Empty shows the animated scene only. */
  images: { src: string; caption: string }[]
}

export const projects: Project[] = [
  {
    id: 'anyash',
    name: 'Anyash',
    tagline: 'A health companion that calls you.',
    kind: 'Voice agent + web dashboard',
    year: '2025',
    role: 'Research, product design, full-stack',
    team: 'Solo', // TODO: confirm
    stack: ['React', 'TypeScript', 'Node.js', 'Voice AI', 'LLMs', 'AWS'],
    status: 'live',
    href: '#', // TODO
    hrefLabel: 'Dashboard',
    overview:
      'Anyash phones you, asks how you slept and what you ate, writes it down, and calls back to follow up. A dashboard turns those conversations into trends and small, specific recommendations.',
    problem:
      'Health tracking depends on the person remembering to open an app. Most people log for a few days, miss one, and never come back. The data dies right when it would start being useful.',
    findings: [
      'People didn’t lack motivation. They lacked a moment that pulled them in.',
      'Typing a meal into a form felt like a chore. Saying it out loud took seconds.',
      'A reminder is easy to swipe away. A ringing phone gets answered.',
    ],
    flow: [
      { title: 'Call', text: 'Anyash calls at the time you picked.' },
      { title: 'Talk', text: 'A short conversation about sleep, meals and how you feel.' },
      { title: 'Log', text: 'The conversation becomes structured entries, no forms.' },
      { title: 'Follow up', text: 'It calls back on what matters and suggests one next step.' },
    ],
    decisions: [
      { title: 'Voice first, screen second', why: 'The call does the tracking. The dashboard is only for looking back.' },
      { title: 'Short calls', why: 'A check-in that drags becomes one people avoid.' },
      { title: 'One recommendation at a time', why: 'A list of ten changes gets ignored. One gets tried.' },
    ],
    metrics: [], // TODO: e.g. calls made, users, retention, average call length
    outcome: 'Live. The voice agent and the dashboard are deployed and working end to end.',
    images: [],
  },
  {
    id: 'have',
    name: 'Have',
    tagline: 'Three good things. Ten seconds a day.',
    kind: 'iOS app',
    year: '2025',
    role: 'Design and iOS development',
    team: 'Solo', // TODO: confirm
    stack: ['Swift', 'SwiftUI'],
    status: 'live',
    href: '#', // TODO: App Store link
    hrefLabel: 'App Store',
    overview:
      'Have is a gratitude journal that asks for three good things a day, then gets out of the way. No feed, no streak guilt, no account.',
    problem:
      'Journaling helps, but most journaling apps feel like homework: blank pages, prompts, tags, moods. The friction is the reason people stop.',
    findings: [
      'A blank page is the hardest part. A fixed number, three, makes it easy to start.',
      'People wanted it to be quick, not clever.',
    ],
    flow: [
      { title: 'Open', text: 'The app opens straight to today.' },
      { title: 'Write', text: 'Three short lines. That’s it.' },
      { title: 'Look back', text: 'Past days are a calm scroll, not a dashboard.' },
    ],
    decisions: [
      { title: 'No sign-up', why: 'Anything before the first entry is a reason to quit.' },
      { title: 'Native SwiftUI', why: 'It should feel like part of the phone, fast and offline.' },
    ],
    metrics: [], // TODO: downloads, rating, daily users
    outcome: 'Shipped and live on the App Store.',
    images: [],
  },
  {
    id: 'easily',
    name: 'Easily',
    tagline: 'Ask the person who’s already done it.',
    kind: 'Web platform',
    year: '2024',
    role: 'Product, design, full-stack',
    team: 'Solo', // TODO: confirm
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Embeddings'],
    status: 'private',
    overview:
      'Easily takes a question and routes it to people who have lived through that exact situation, instead of whoever happens to reply first.',
    problem:
      'Forums reward fast answers, not right ones. The person who has actually been through your situation rarely sees your question.',
    findings: [
      'The most useful answers came from experience, not expertise.',
      'People were happy to help when the question was clearly meant for them.',
    ],
    flow: [
      { title: 'Ask', text: 'You write the question in plain words.' },
      { title: 'Match', text: 'It finds people whose experience fits the question.' },
      { title: 'Answer', text: 'They get a short, direct ask, and you get a real answer.' },
    ],
    decisions: [
      { title: 'Match on experience, not tags', why: 'Tags say what someone knows. Experience says what they have lived.' },
      { title: 'Small asks', why: 'One relevant question to the right person beats a broadcast to everyone.' },
    ],
    metrics: [],
    outcome: 'Private repo. I’m happy to walk you through it on a call.',
    images: [],
  },
  {
    id: 'learn',
    name: 'AI Learning Platform',
    tagline: 'A tutor that changes pace with you.',
    kind: 'Web platform',
    year: '2024',
    role: 'Design and full-stack',
    team: 'Solo', // TODO: confirm
    stack: ['React', 'Node.js', 'LLMs', 'AWS'],
    status: 'private',
    overview:
      'Lessons with an AI tutor beside them. Stuck? Ask for it simpler. Bored? Go deeper. Think you’ve got it? Get quizzed.',
    problem: 'Courses move at one speed. Learners don’t, so some get lost and others get bored.',
    findings: [
      'Confused learners rarely know what to ask. They need a nudge, not a blank chat box.',
    ],
    flow: [
      { title: 'Learn', text: 'Short lesson blocks.' },
      { title: 'Steer', text: 'Simpler, deeper, or quiz me: one tap each.' },
      { title: 'Track', text: 'Progress shows what’s actually understood.' },
    ],
    decisions: [
      { title: 'Buttons over a blank chat', why: 'People don’t know what to ask when they’re confused.' },
    ],
    metrics: [],
    outcome: 'It needs heavy servers, so it isn’t public. A recorded demo is available on request.',
    images: [],
  },
]

export const fiverr = { reviews: 32 }

export const education = { degree: 'B.Tech', school: 'Lovely Professional University', years: '2023–27' }

export const tools = ['React', 'TypeScript', 'Next.js', 'SwiftUI', 'Node.js', 'Postgres', 'AWS', 'LLMs', 'Figma']
