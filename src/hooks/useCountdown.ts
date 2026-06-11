import { useEffect, useState } from 'react'

export function useCountdown(
  expiresAt: Date | string | null,
  onExpire?: () => void,
  options?: { paused?: boolean },
) {
  const paused = options?.paused ?? false
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(expiresAt))

  useEffect(() => {
    if (!expiresAt || paused) {
      return
    }

    const interval = window.setInterval(() => {
      const nextRemaining = getRemainingMs(expiresAt)
      setRemainingMs(nextRemaining)

      if (nextRemaining <= 0) {
        window.clearInterval(interval)
        onExpire?.()
      }
    }, 250)

    return () => window.clearInterval(interval)
  }, [expiresAt, onExpire, paused])

  return {
    remainingMs,
    isExpired: remainingMs <= 0,
    formatted: formatCountdown(remainingMs),
  }
}

function getRemainingMs(expiresAt: Date | string | null) {
  if (!expiresAt) {
    return 0
  }

  const target = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt
  return Math.max(0, target.getTime() - Date.now())
}

export function formatCountdown(remainingMs: number) {
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
