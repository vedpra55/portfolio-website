import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CommandMenu } from './components/CommandMenu'
import { Info } from './components/Info'
import { Meta, Profile, Roll } from './components/Profile'
import { ProjectSheet } from './components/ProjectSheet'
import { Work } from './components/Work'
import { profile, projects, type Project } from './data'
import { AppContext, copyText, ease, spring, useTheme, type AppApi } from './lib'

const tabs = ['work', 'info'] as const
type Tab = (typeof tabs)[number]

// State lives in the hash: #work, #info, #work/<project>.
function readHash() {
  const [tab, id] = location.hash.slice(1).split('/')
  return {
    tab: (tabs as readonly string[]).includes(tab) ? (tab as Tab) : 'work',
    id: projects.find((p) => p.id === id)?.id ?? null,
  }
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [tab, setTab] = useState<Tab>(() => readHash().tab)
  const [openId, setOpenId] = useState<Project['id'] | null>(() => readHash().id)
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const go = useCallback((next: Tab, id: Project['id'] | null = null) => {
    history.replaceState(null, '', `#${next}${id ? `/${id}` : ''}`)
    setTab(next)
    setOpenId(id)
  }, [])

  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      setTab(h.tab)
      setOpenId(h.id)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setMenu((m) => !m)
        return
      }
      // Arrow keys flip tabs when nothing else is focused.
      const idle = document.activeElement === document.body && !document.querySelector('[role="dialog"]')
      if (idle && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) go(e.key === 'ArrowLeft' ? 'work' : 'info')
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('keydown', onKey)
    }
  }, [go])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const api = useMemo<AppApi>(
    () => ({
      theme,
      toggleTheme,
      openProject: (id) => go('work', id),
      openMenu: () => setMenu(true),
      copyEmail: () => copyText(profile.email).then(() => setToast('Email copied')),
    }),
    [theme, toggleTheme, go],
  )

  return (
    <AppContext value={api}>
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          <div className="mx-auto grid w-full max-w-[1040px] gap-14 px-6 py-14 sm:px-10 lg:grid-cols-[300px_1fr] lg:gap-24 lg:py-0">
            <aside className="lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:py-20">
              <Profile />
              <div className="hidden lg:block">
                <Meta />
              </div>
            </aside>

            <main className="min-w-0 lg:py-20">
              <nav className="flex gap-6 border-b border-line" role="tablist">
                {tabs.map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => go(t)}
                    className={`relative pb-3 capitalize transition-colors ${tab === t ? 'text-ink' : 'text-muted hover:text-ink'}`}
                  >
                    {t}
                    {t === 'work' && <span className="ml-1.5 text-faint tabular-nums">{projects.length}</span>}
                    {tab === t && (
                      <motion.span layoutId="tab-line" transition={spring} className="absolute inset-x-0 -bottom-px h-px bg-ink" />
                    )}
                  </button>
                ))}
              </nav>

              <AnimatePresence mode="wait" initial={false}>
                <motion.section
                  key={tab}
                  role="tabpanel"
                  initial={{ opacity: 0, x: tab === 'info' ? 12 : -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === 'info' ? -12 : 12, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.35, ease }}
                  className="pt-8"
                >
                  {tab === 'work' ? <Work openId={openId} /> : <Info />}
                </motion.section>
              </AnimatePresence>

              <div className="mt-20 border-t border-line pt-6 lg:hidden">
                <Meta />
              </div>
            </main>
          </div>

          <ProjectSheet id={openId} onClose={() => go('work')} />
        </LayoutGroup>

        <CommandMenu open={menu} onClose={() => setMenu(false)} />

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 8, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: 4, x: '-50%' }}
              transition={spring}
              role="status"
              className="fixed bottom-6 left-1/2 z-[70] rounded-lg bg-ink px-3 py-2 text-sm text-bg"
            >
              <Roll>{toast}</Roll>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </AppContext>
  )
}
