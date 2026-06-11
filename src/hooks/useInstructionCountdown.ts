import { useEffect, useRef, useState } from 'react'
import { formatCountdown } from '#/hooks/useCountdown'

const INSTRUCTION_DURATION_MS = 2 * 60 * 1000

export function useInstructionCountdown(onExpire: () => void, enabled = true) {
  const [remainingMs, setRemainingMs] = useState(INSTRUCTION_DURATION_MS)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (!enabled) {
      return
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      const next = Math.max(0, INSTRUCTION_DURATION_MS - (Date.now() - startedAt))
      setRemainingMs(next)

      if (next <= 0) {
        window.clearInterval(interval)
        onExpireRef.current()
      }
    }, 250)

    return () => window.clearInterval(interval)
  }, [enabled])

  return {
    remainingMs: enabled ? remainingMs : INSTRUCTION_DURATION_MS,
    formatted: formatCountdown(enabled ? remainingMs : INSTRUCTION_DURATION_MS),
    isExpired: enabled && remainingMs <= 0,
  }
}
