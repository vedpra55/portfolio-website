import { AnimatePresence, LayoutGroup, motion, MotionConfig } from 'motion/react'
import { Check } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CommandMenu } from './components/CommandMenu'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { ProjectSheet } from './components/ProjectSheet'
import { Proof } from './components/Proof'
import { Work } from './components/Work'
import { profile, projects, type Project } from './data'
import { AppContext, copyText, spring, useTheme, type AppApi } from './lib'

// Case studies are deep-linkable as #work/<id>.
const fromHash = () => {
  const id = location.hash.match(/^#work\/(\w+)/)?.[1]
  return projects.find((p) => p.id === id)?.id ?? null
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [openId, setOpenId] = useState<Project['id'] | null>(fromHash)
  const [menu, setMenu] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const onHash = () => setOpenId(fromHash())
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setMenu((m) => !m)
      }
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(id)
  }, [toast])

  const openProject = useCallback((id: Project['id']) => {
    history.replaceState(null, '', `#work/${id}`)
    setOpenId(id)
  }, [])

  const closeProject = useCallback(() => {
    history.replaceState(null, '', location.pathname)
    setOpenId(null)
  }, [])

  const api = useMemo<AppApi>(
    () => ({
      theme,
      toggleTheme,
      openProject,
      openMenu: () => setMenu(true),
      copyEmail: () => copyText(profile.email).then(() => setToast('Email copied')),
    }),
    [theme, toggleTheme, openProject],
  )

  return (
    <AppContext value={api}>
      <MotionConfig reducedMotion="user">
        <Nav />
        <LayoutGroup>
          <main className="mx-auto w-full max-w-[960px] px-5 sm:px-8">
            <Hero />
            <Work openId={openId} />
            <Proof />
            <Footer />
          </main>
          <ProjectSheet id={openId} onClose={closeProject} />
        </LayoutGroup>
        <CommandMenu open={menu} onClose={() => setMenu(false)} />
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9, x: '-50%' }}
              animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
              exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
              transition={spring}
              role="status"
              className="fixed bottom-6 left-1/2 z-[70] flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-bg shadow-lg"
            >
              <Check className="size-4 text-live" strokeWidth={2.5} /> {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </AppContext>
  )
}
