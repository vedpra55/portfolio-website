import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { CommandMenu } from './components/CommandMenu'
import { Info } from './components/Info'
import { Meta, Profile, Roll } from './components/Profile'
import { ProjectPage } from './components/ProjectPage'
import { Work } from './components/Work'
import { profile, projects } from './data'
import { AppContext, copyText, ease, navigate, spring, usePath, useTheme, type AppApi } from './lib'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const path = usePath()
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const project = projects.find((p) => path === `/work/${p.id}`)
  const tab = path === '/info' ? 'info' : 'work'

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setMenu((m) => !m)
        return
      }
      // Arrow keys flip tabs when nothing else is focused.
      const idle = document.activeElement === document.body && !document.querySelector('[role="dialog"]')
      if (idle && !location.pathname.startsWith('/work/') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight'))
        navigate(e.key === 'ArrowLeft' ? '/' : '/info')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // New page starts at the top; going back to the list restores where you were.
  useEffect(() => {
    if (project) window.scrollTo({ top: 0 })
    document.title = project ? `${project.name} · ${profile.name}` : `${profile.name} · ${profile.role}`
  }, [project])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const api = useMemo<AppApi>(
    () => ({
      theme,
      toggleTheme,
      openProject: (id) => navigate(`/work/${id}`),
      openMenu: () => setMenu(true),
      copyEmail: () => copyText(profile.email).then(() => setToast('Email copied')),
    }),
    [theme, toggleTheme],
  )

  return (
    <AppContext value={api}>
      <MotionConfig reducedMotion="user">
        <LayoutGroup>
          <div className="mx-auto grid w-full max-w-[1080px] gap-14 px-6 py-14 sm:px-10 lg:grid-cols-[280px_1fr] lg:gap-24 lg:py-0">
            <aside
              className={`lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between lg:py-20 ${project ? 'hidden lg:flex' : ''}`}
            >
              <Profile />
              <div className="hidden lg:block">
                <Meta />
              </div>
            </aside>

            <main className="min-w-0 lg:py-20">
              {project ? (
                <ProjectPage key={project.id} project={project} />
              ) : (
                <>
                  <nav className="flex gap-6 border-b border-line" role="tablist">
                    {(['work', 'info'] as const).map((t) => (
                      <a
                        key={t}
                        href={t === 'work' ? '/' : '/info'}
                        role="tab"
                        aria-selected={tab === t}
                        onClick={(e) => {
                          e.preventDefault()
                          navigate(t === 'work' ? '/' : '/info')
                        }}
                        className={`relative pb-3 capitalize transition-colors ${tab === t ? 'text-ink' : 'text-muted hover:text-ink'}`}
                      >
                        {t}
                        {t === 'work' && <span className="ml-1.5 text-faint tabular-nums">{projects.length}</span>}
                        {tab === t && (
                          <motion.span layoutId="tab-line" transition={spring} className="absolute inset-x-0 -bottom-px h-px bg-ink" />
                        )}
                      </a>
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
                      className="pt-6"
                    >
                      {tab === 'work' ? <Work /> : <Info />}
                    </motion.section>
                  </AnimatePresence>
                </>
              )}

              <div className="mt-20 border-t border-line pt-6 lg:hidden">
                <Meta />
              </div>
            </main>
          </div>
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
