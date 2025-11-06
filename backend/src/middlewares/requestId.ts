import type { Request, Response, NextFunction } from 'express';

function genId() {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function withRequestId(req: Request, res: Response, next: NextFunction) {
  const rid = (req.headers['x-request-id'] as string | undefined) || genId();
  (req as any).requestId = rid;
  res.setHeader('X-Request-Id', rid);
  next();
}
