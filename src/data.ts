// All site content lives here. Edit this file to update the portfolio.

export const profile = {
  name: 'Ved Pratap Singh',
  first: 'Ved',
  role: 'Product engineer',
  bio: 'I research the real problem, design the fix, and build it end to end. Frontend is where I’m happiest.',
  // TODO: replace with your real address.
  email: 'hello@example.com',
  photo: '/img/ved.jpg',
  timeZone: 'Asia/Kolkata',
  place: 'India',
}

export type LinkId = 'github' | 'linkedin' | 'x' | 'fiverr' | 'email'

export const links: { id: LinkId; label: string; handle: string; href: string }[] = [
  { id: 'github', label: 'GitHub', handle: 'vedpra55', href: 'https://github.com/vedpra55' },
  { id: 'linkedin', label: 'LinkedIn', handle: 'ved-pratap-singh', href: 'https://www.linkedin.com/in/ved-pratap-singh/' },
  { id: 'x', label: 'X', handle: '@vedthinks', href: 'https://x.com/vedthinks' },
  { id: 'fiverr', label: 'Fiverr', handle: '5.0 ★ · 32 reviews', href: 'https://www.fiverr.com/s/7jjg0qa' },
]

export type ProjectStatus = 'live' | 'private'

export type Project = {
  id: 'anyash' | 'have' | 'easily' | 'learn'
  name: string
  tagline: string
  kind: string
  year: string
  role: string
  stack: string[]
  status: ProjectStatus
  // TODO: add the real live / App Store links.
  href?: string
  story: { label: string; text: string }[]
}

export const projects: Project[] = [
  {
    id: 'anyash',
    name: 'Anyash',
    tagline: 'An AI that calls you about your health.',
    kind: 'Voice agent · Web',
    year: '2025',
    role: 'Research, design, full-stack',
    stack: ['React', 'TypeScript', 'Voice AI', 'LLMs'],
    status: 'live',
    href: '#',
    story: [
      { label: 'Problem', text: 'People track sleep and diet for a week, then quietly stop.' },
      { label: 'Insight', text: 'Apps wait to be opened. A phone call doesn’t.' },
      { label: 'Build', text: 'Agent that calls, logs sleep & diet from conversation, follows up.' },
      { label: 'Outcome', text: 'Live agent + dashboard with personal recommendations.' },
    ],
  },
  {
    id: 'have',
    name: 'Have',
    tagline: 'Three good things. Ten seconds a day.',
    kind: 'iOS app',
    year: '2025',
    role: 'Design & iOS development',
    stack: ['SwiftUI', 'iOS'],
    status: 'live',
    href: '#',
    story: [
      { label: 'Problem', text: 'Journaling apps feel like homework.' },
      { label: 'Insight', text: 'Shrink the ritual until skipping it feels silly.' },
      { label: 'Build', text: 'Native, offline-first gratitude journal. No accounts.' },
      { label: 'Outcome', text: 'Shipped to the App Store.' },
    ],
  },
  {
    id: 'easily',
    name: 'Easily',
    tagline: 'Your question, routed to someone who’s lived it.',
    kind: 'Platform · Web',
    year: '2024',
    role: 'Product, design, full-stack',
    stack: ['Next.js', 'TypeScript', 'Postgres', 'Embeddings'],
    status: 'private',
    story: [
      { label: 'Problem', text: 'The best answers live in people, not search results.' },
      { label: 'Insight', text: 'Match on experience, not on who replies fastest.' },
      { label: 'Build', text: 'Routing engine that sends each question to the right person.' },
      { label: 'Outcome', text: 'Private repo. Happy to walk you through it.' },
    ],
  },
  {
    id: 'learn',
    name: 'AI Learning Platform',
    tagline: 'A tutor that adapts to how you learn.',
    kind: 'EdTech · Web',
    year: '2024',
    role: 'Design & full-stack',
    stack: ['React', 'Node.js', 'LLMs'],
    status: 'private',
    story: [
      { label: 'Problem', text: 'Courses move at one speed. Learners don’t.' },
      { label: 'Insight', text: 'Let the learner steer: simpler, deeper, quiz me.' },
      { label: 'Build', text: 'Lessons with an AI tutor, progress tracking and quizzes.' },
      { label: 'Outcome', text: 'Server-heavy, so not public. Demo on request.' },
    ],
  },
]

export const fiverr = { rating: '5.0', reviews: 32 }

export const tools = ['React', 'TypeScript', 'Next.js', 'SwiftUI', 'Node.js', 'Postgres', 'LLMs', 'Figma']
