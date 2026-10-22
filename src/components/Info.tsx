import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { fiverr, links, tools } from '../data'
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
        I start with the people who have the problem, not the solution. Then I design the smallest thing that
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
        2nd place and a $20k prize in a Google startup program, as a core builder on the team. Pitched at startup
        events through college.
      </>
    ),
  },
  { label: 'Tools', body: tools.join(', ') + '.' },
]

export function Info() {
  return (
    <div className="divide-y divide-line">
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.04 * i }}
          className="grid gap-1 py-5 first:pt-0 sm:grid-cols-[120px_1fr] sm:gap-6"
        >
          <span className="text-muted">{r.label}</span>
          <p className="leading-relaxed">{r.body}</p>
        </motion.div>
      ))}
    </div>
  )
}
