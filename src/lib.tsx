import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Project } from './data'

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
const listeners = new Set<() => void>()
window.addEventListener('popstate', () => listeners.forEach((l) => l()))

export function navigate(path: string) {
  if (path === location.pathname) return
  history.pushState(null, '', path)
  listeners.forEach((l) => l())
}

export function usePath() {
  const [path, setPath] = useState(location.pathname)
  useEffect(() => {
    const l = () => setPath(location.pathname)
    listeners.add(l)
    return () => {
      listeners.delete(l)
    }
  }, [])
  return path
}
