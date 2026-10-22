import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Copy, CornerDownLeft, Moon, Search, Sun } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { links, projects } from '../data'
import { spring, useApp } from '../lib'
import { BrandIcon } from './BrandIcon'
import { sceneBg } from './Previews'

type Item = { id: string; group: string; label: string; hint?: string; icon: ReactNode; run: () => void }

export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-bg/50 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-x-0 top-[14vh] z-[60] flex justify-center px-4">
            <Menu onClose={onClose} />
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function Menu({ onClose }: { onClose: () => void }) {
  const { theme, toggleTheme, copyEmail, openProject } = useApp()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  const all = useMemo<Item[]>(
    () => [
      ...projects.map((p) => ({
        id: p.id,
        group: 'Work',
        label: p.name,
        hint: p.tagline,
        icon: <span className={`size-4 rounded-[5px] ring-1 ring-black/5 ${sceneBg[p.id]}`} />,
        run: () => openProject(p.id),
      })),
      { id: 'email', group: 'Actions', label: 'Copy email', icon: <Copy className="size-4" />, run: copyEmail },
      {
        id: 'theme',
        group: 'Actions',
        label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`,
        icon: theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />,
        run: toggleTheme,
      },
      ...links.map((l) => ({
        id: l.id,
        group: 'Elsewhere',
        label: l.label,
        hint: l.handle,
        icon: <BrandIcon id={l.id} className="size-4" />,
        run: () => window.open(l.href, '_blank', 'noreferrer'),
      })),
    ],
    [theme, toggleTheme, copyEmail, openProject],
  )

  const items = all.filter((i) => `${i.label} ${i.hint ?? ''} ${i.group}`.toLowerCase().includes(q.trim().toLowerCase()))
  const current = Math.min(sel, Math.max(items.length - 1, 0))

  const run = (item?: Item) => {
    if (!item) return
    onClose()
    item.run()
  }

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${current}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [current])

  let lastGroup = ''
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -6, transition: { duration: 0.12 } }}
      transition={spring}
      role="dialog"
      aria-label="Command menu"
      className="pointer-events-auto w-full max-w-[480px] overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--line),0_30px_80px_-30px_rgb(0_0_0/0.35)]"
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setSel((current + 1) % items.length) }
        if (e.key === 'ArrowUp') { e.preventDefault(); setSel((current - 1 + items.length) % items.length) }
        if (e.key === 'Enter') { e.preventDefault(); run(items[current]) }
        if (e.key === 'Escape') onClose()
      }}
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => { setQ(e.target.value); setSel(0) }}
          placeholder="Jump to a project, copy email…"
          className="h-12 flex-1 bg-transparent outline-none placeholder:text-faint"
        />
        <kbd className="text-sm text-faint">esc</kbd>
      </div>
      <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
        {items.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted">Nothing here. Try “email”.</p>}
        {items.map((item, i) => {
          const header = item.group !== lastGroup ? (lastGroup = item.group) : null
          return (
            <div key={item.id}>
              {header && <div className="px-3 pt-3 pb-1 text-sm text-faint">{header}</div>}
              <button
                data-index={i}
                onPointerMove={() => setSel(i)}
                onClick={() => run(item)}
                className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left"
              >
                {i === current && <motion.span layoutId="cmd-sel" transition={spring} className="absolute inset-0 rounded-lg bg-sunken" />}
                <span className="relative grid size-5 place-items-center text-muted">{item.icon}</span>
                <span className="relative">{item.label}</span>
                {item.hint && <span className="relative truncate text-muted">{item.hint}</span>}
                <span className="relative ml-auto text-faint">
                  {item.group === 'Elsewhere' ? <ArrowUpRight className="size-3.5" /> : i === current && <CornerDownLeft className="size-3.5" />}
                </span>
              </button>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
