import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { projects, type Project } from './data'

type Theme = 'light' | 'dark'

export type AppApi = {
  theme: Theme
  toggleTheme: () => void
  copyEmail: () => void
  openProject: (id: Project['id']) => void
  openMenu: () => void
}

export const AppContext = createContext<AppApi | null>(null)

export function useApp() {
  const api = useContext(AppContext)
  if (!api) throw new Error('useApp must be used inside AppContext')
  return api
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      // Storage can be unavailable (private mode); the theme still works for this visit.
    }
  }, [theme])
  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return [theme, toggle] as const
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

export function timeIn(date: Date, timeZone: string) {
  const time = new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(date)
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', hourCycle: 'h23' }).format(date))
  return { time, awake: hour >= 8 && hour < 24 }
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
  }
}

export const ease = [0.22, 1, 0.36, 1] as const
export const spring = { type: 'spring', stiffness: 380, damping: 32 } as const

// Minimal history router: /, /info, /work/<id>.
// Page changes run inside a View Transition so the clicked thumbnail can morph
// between the list and the project page; the browser snapshots both states, so
// scrolling to the new position can't throw the animation off.
const listeners = new Set<() => void>()
const known = new RegExp(`^/(info|work/(${projects.map((p) => p.id).join('|')}))?$`)
const scrollPos = new Map<string, number>()
let current = location.pathname

if (!known.test(current)) {
  history.replaceState(null, '', '/')
  current = '/'
}
history.scrollRestoration = 'manual'

function commit(update: () => void) {
  scrollPos.set(current, window.scrollY)
  const run = () => {
    flushSync(() => {
      update()
      current = known.test(location.pathname) ? location.pathname : '/'
      listeners.forEach((l) => l())
    })
    // Project pages open at the top; the list and Info come back to where you left them.
    window.scrollTo(0, current.startsWith('/work/') ? 0 : (scrollPos.get(current) ?? 0))
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduce) run()
  else document.startViewTransition(run)
}

window.addEventListener('popstate', () => commit(() => {}))

export function navigate(path: string) {
  if (path === location.pathname) return
  commit(() => history.pushState(null, '', path))
}

export function usePath() {
  const [path, setPath] = useState(current)
  useEffect(() => {
    const l = () => setPath(current)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return path
}
