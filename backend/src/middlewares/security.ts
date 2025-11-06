import type { Request, Response, NextFunction } from 'express';

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  // Ajuste CSP conforme necessidade do front/domínios
  const csp =
    "default-src 'self'; connect-src 'self' https://api.openai.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'";
  res.setHeader('Content-Security-Policy', csp);
  // HSTS em produção
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
}

export function noStore(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store');
  next();
}

export function requireAuthIfConfigured(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.SERVICE_API_KEY;
  const requireAuth = process.env.REQUIRE_AUTH === 'true' && !!expected;
  if (!requireAuth) return next();
  const auth = req.headers['authorization'] || '';
  if (auth === `Bearer ${expected}`) return next();
  return res
    .status(401)
    .json({ error: { code: 'unauthorized', message: 'Missing or invalid credentials' } });
}
