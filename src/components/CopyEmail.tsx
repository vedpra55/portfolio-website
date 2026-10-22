import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { profile } from '../data'
import { copyText, spring } from '../lib'

export function CopyEmail() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <motion.button
      layout
      onClick={() => copyText(profile.email).then(() => setCopied(true))}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      title={profile.email}
      className="relative flex h-13 items-center gap-2.5 overflow-hidden rounded-full bg-ink px-6 text-[15px] font-medium text-bg shadow-[0_12px_30px_-12px_rgb(0_0_0/0.5)]"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? 'done' : 'idle'}
          initial={{ y: 20, opacity: 0, filter: 'blur(4px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -20, opacity: 0, filter: 'blur(4px)' }}
          transition={spring}
          className="flex items-center gap-2.5"
        >
          {copied ? (
            <>
              <Check className="size-4 text-live" strokeWidth={2.5} /> Copied. Talk soon
            </>
          ) : (
            <>
              <Copy className="size-4 opacity-60" /> Copy email
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
