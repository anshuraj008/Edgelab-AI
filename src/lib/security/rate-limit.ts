/**
 * In-memory sliding window rate limiter for API endpoints
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  identifier: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { timestamps: [] };

  // Remove timestamps outside the current window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0];
    const reset = Math.ceil((oldest + windowMs - now) / 1000);
    return { success: false, remaining: 0, reset };
  }

  validTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: validTimestamps });

  return {
    success: true,
    remaining: limit - validTimestamps.length,
    reset: Math.ceil(windowMs / 1000),
  };
}
