import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import { profile } from '../data'
import { spring, timeIn, useApp, useNow } from '../lib'

export function Nav() {
  const { theme, toggleTheme, openMenu } = useApp()
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setCompact(y > 80))
  const { time } = timeIn(useNow(), profile.timeZone)
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <motion.nav
        layout
        transition={spring}
        className="pointer-events-auto flex items-center gap-1 rounded-full border border-line bg-surface/75 p-1.5 shadow-[var(--shadow)] backdrop-blur-xl"
      >
        <motion.a layout href="#top" className="flex items-center gap-2 rounded-full py-0.5 pr-3 pl-0.5" aria-label="Back to top">
          <img src={profile.photo} alt="" className="size-7 rounded-full object-cover" />
          <span className="text-sm font-medium">{profile.first}</span>
        </motion.a>

        <AnimatePresence initial={false}>
          {!compact && (
            <motion.span
              key="clock"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={spring}
              className="hidden overflow-hidden font-mono text-xs whitespace-nowrap text-muted sm:block"
            >
              <span className="px-2">{time} · {profile.place}</span>
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          layout
          onClick={openMenu}
          whileTap={{ scale: 0.94 }}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sunken hover:text-ink"
        >
          Menu
          <kbd className="rounded-md border border-line bg-bg px-1.5 font-mono text-[10px]">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </motion.button>

        <motion.button
          layout
          onClick={toggleTheme}
          whileTap={{ scale: 0.88 }}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          className="relative grid size-8 place-items-center overflow-hidden rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={theme}
              initial={{ y: 18, rotate: -90, opacity: 0 }}
              animate={{ y: 0, rotate: 0, opacity: 1 }}
              exit={{ y: -18, rotate: 90, opacity: 0 }}
              transition={spring}
            >
              {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.nav>
    </div>
  )
}
