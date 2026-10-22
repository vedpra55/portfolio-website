import { motion, useInView } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { projects, type Project } from '../data'
import { ease, navigate, useApp } from '../lib'
import { Status, Thumb } from './Work'

export function ProjectPage({ project: p }: { project: Project }) {
  const { openProject, copyEmail } = useApp()
  const i = projects.indexOf(p)
  const prev = projects[(i - 1 + projects.length) % projects.length]
  const next = projects[(i + 1) % projects.length]

  // Esc goes back to the list; [ and ] flip between projects.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || document.querySelector('[role="dialog"]')) return
      if (e.key === 'Escape') navigate('/')
      if (e.key === '[') openProject(prev.id)
      if (e.key === ']') openProject(next.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next, openProject])

  return (
    <article>
      <nav className="flex items-baseline justify-between border-b border-line pb-3 text-muted">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
          }}
          className="group transition-colors hover:text-ink"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-0.5">←</span> Work
        </a>
        <span className="flex items-baseline gap-3">
          <span className="text-faint tabular-nums">
            {i + 1} / {projects.length}
          </span>
          <button onClick={() => openProject(prev.id)} className="transition-colors hover:text-ink" aria-label={`Previous: ${prev.name}`} title="Previous  [">
            ↑
          </button>
          <button onClick={() => openProject(next.id)} className="transition-colors hover:text-ink" aria-label={`Next: ${next.name}`} title="Next  ]">
            ↓
          </button>
        </span>
      </nav>

      <header className="pt-10">
        <Reveal delay={0.08}>
          <h1 className="text-[22px] font-medium tracking-[-0.01em]">{p.name}</h1>
          <p className="mt-1 text-[18px] text-muted">{p.tagline}</p>
        </Reveal>
      </header>

      <div className="mt-8">
        <Hero id={p.id} />
      </div>

      <Reveal delay={0.2}>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          <Meta label="Role">{p.role}</Meta>
          <Meta label="Year">{p.year}</Meta>
          <Meta label="Team">{p.team}</Meta>
          <Meta label="Status">
            <Status project={p} />
            {p.href && (
              <a href={p.href} target="_blank" rel="noreferrer" className="link mt-0.5 block w-fit">
                {p.hrefLabel ?? 'Open'} ↗
              </a>
            )}
            {p.status === 'private' && (
              <button onClick={copyEmail} className="link mt-0.5 block">
                Ask for a demo
              </button>
            )}
          </Meta>
        </dl>
      </Reveal>

      <div className="mt-14 border-t border-line">
        <Section label="Overview">
          <p className="text-[17px] leading-relaxed">{p.overview}</p>
        </Section>

        <Section label="Problem">
          <p className="leading-relaxed">{p.problem}</p>
        </Section>

        {p.findings.length > 0 && (
          <Section label="What I found">
            <ul className="flex flex-col gap-2.5">
              {p.findings.map((f) => (
                <li key={f} className="grid grid-cols-[18px_1fr] leading-relaxed">
                  <span className="text-faint">–</span>
                  {f}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Section label="How it works">
          <ol className="relative flex flex-col gap-5">
            <span className="absolute top-2 bottom-2 left-[9px] w-px bg-line" aria-hidden />
            {p.flow.map((s, n) => (
              <li key={s.title} className="relative grid grid-cols-[32px_1fr]">
                <span className="relative grid size-[19px] place-items-center rounded-full bg-bg text-[11px] text-muted shadow-[0_0_0_1px_var(--line)] tabular-nums">
                  {n + 1}
                </span>
                <span className="leading-relaxed">
                  <span className="font-medium">{s.title}.</span> <span className="text-muted">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="Decisions">
          <div className="flex flex-col gap-4">
            {p.decisions.map((d) => (
              <div key={d.title}>
                <p className="font-medium">{d.title}</p>
                <p className="mt-0.5 leading-relaxed text-muted">{d.why}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section label="Outcome">
          {p.metrics.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {p.metrics.map((m) => (
                <div key={m.label}>
                  <p className="text-[22px] font-medium tabular-nums">{m.value}</p>
                  <p className="text-sm text-muted">{m.label}</p>
                </div>
              ))}
            </div>
          )}
          <p className="leading-relaxed">{p.outcome}</p>
        </Section>

        <Section label="Stack">
          <p className="leading-relaxed">{p.stack.join(', ')}</p>
        </Section>

        {p.images.length > 0 && (
          <Section label="Screens">
            <div className="flex flex-col gap-6">
              {p.images.map((img) => (
                <figure key={img.src}>
                  <img src={img.src} alt={img.caption} loading="lazy" className="w-full rounded-[10px] shadow-[0_0_0_1px_var(--line)]" />
                  <figcaption className="mt-2 text-sm text-muted">{img.caption}</figcaption>
                </figure>
              ))}
            </div>
          </Section>
        )}
      </div>

      <a
        href={`/work/${next.id}`}
        onClick={(e) => {
          e.preventDefault()
          // Name this thumbnail only now, so it (and nothing else) morphs into the next page's header.
          const thumb = e.currentTarget.querySelector<HTMLElement>('[data-thumb]')
          if (thumb) thumb.style.viewTransitionName = `thumb-${next.id}`
          openProject(next.id)
        }}
        className="group mt-16 flex items-center justify-between gap-5 border-t border-line pt-6"
      >
        <span>
          <span className="block text-sm text-muted">Next project</span>
          <span className="font-medium">{next.name}</span>{' '}
          <span className="inline-block text-muted transition-transform group-hover:translate-x-1">→</span>
          <span className="mt-0.5 block text-muted">{next.tagline}</span>
        </span>
        <div data-thumb className="w-28 shrink-0 overflow-hidden rounded-[10px]">
          <Thumb id={next.id} active={false} />
        </div>
      </a>
    </article>
  )
}

function Hero({ id }: { id: Project['id'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  return (
    <div ref={ref}>
      <Thumb id={id} name={`thumb-${id}`} active={inView} />
    </div>
  )
}

function Meta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-0.5 text-[15px] leading-snug">{children}</dd>
    </div>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="grid gap-2 border-b border-line py-7 sm:grid-cols-[132px_1fr] sm:gap-6">
        <h2 className="text-muted">{label}</h2>
        <div>{children}</div>
      </section>
    </Reveal>
  )
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease, delay }}
    >
      {children}
    </motion.div>
  )
}
