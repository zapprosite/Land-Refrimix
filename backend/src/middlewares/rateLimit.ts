import type { Request, Response, NextFunction } from 'express';

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(options?: { windowMs?: number; max?: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const windowMs = options?.windowMs ?? Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000);
    const max = options?.max ?? Number(process.env.RATE_LIMIT_MAX || 60);
    const testClient =
      process.env.NODE_ENV === 'test'
        ? (req.headers['x-test-client'] as string | undefined)
        : undefined;
    const ip = (
      testClient ||
      req.ip ||
      (req.connection as any).remoteAddress ||
      'unknown'
    ).toString();
    const now = Date.now();
    const bucket = buckets.get(ip) ?? { count: 0, resetAt: now + windowMs };
    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }
    bucket.count += 1;
    buckets.set(ip, bucket);

    if (bucket.count > max) {
      const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: { code: 'rate_limited', message: 'Rate limit exceeded' },
        retryAfter,
        requestId: res.getHeader('X-Request-Id') || '',
      });
    }
    next();
  };
}
