type RateLimitBucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()

export function assertRateLimit(key: string, options: { limit: number; windowMs: number }) {
  const now = Date.now()
  const current = buckets.get(key)

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return
  }

  if (current.count >= options.limit) {
    throw new Error('RATE_LIMITED')
  }

  current.count += 1
}
