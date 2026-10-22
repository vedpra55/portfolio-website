import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { education, fiverr, links, profile, tools } from '../data'
import { ease } from '../lib'

const fiverrHref = links.find((l) => l.id === 'fiverr')!.href

const rows: { label: string; body: ReactNode }[] = [
  {
    label: 'Now',
    body: <>Building Anyash, a voice agent that calls you, asks how you slept and what you ate, and follows up.</>,
  },
  {
    label: 'Approach',
    body: (
      <>
        I start with the people who have the problem, not with the solution. Then I design the smallest thing that
        fixes it and build it myself, frontend to backend.
      </>
    ),
  },
  {
    label: 'Freelance',
    body: (
      <>
        {fiverr.reviews} reviews on{' '}
        <a href={fiverrHref} target="_blank" rel="noreferrer" className="link">Fiverr</a>, all five stars.
      </>
    ),
  },
  {
    label: 'Recognition',
    body: (
      <>
        2nd place and a ₹20,000 prize in a Google startup program, as a core builder on the team. Pitched at startup
        events through college.
      </>
    ),
  },
  {
    label: 'Education',
    body: (
      <>
        {education.degree}, {education.school}
        <span className="text-muted"> · {education.years}</span>
      </>
    ),
  },
  { label: 'Tools', body: tools.join(', ') + '.' },
  {
    label: 'Colophon',
    body: (
      <span className="text-muted">
        Designed and built by hand with Vite, React and Motion. Set in Host Grotesk. Updated {profile.updated}.
      </span>
    ),
  },
]

export function Info() {
  return (
    <div>
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.035 * i }}
          className="grid gap-1 border-b border-line py-5 last:border-0 sm:grid-cols-[132px_1fr] sm:gap-6"
        >
          <span className="text-muted">{r.label}</span>
          <p className="leading-relaxed">{r.body}</p>
        </motion.div>
      ))}
    </div>
  )
}
