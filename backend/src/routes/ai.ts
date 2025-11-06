import type { Request, Response } from 'express';
import { validatePayload } from '../utils/validate';
import { callAI } from '../services/aiService';

export async function postChat(req: Request, res: Response) {
  const requestId = (res.getHeader('X-Request-Id') as string) || '';
  const start = Date.now();

  try {
    if (!req.is('application/json')) {
      return res.status(400).json({
        error: { code: 'invalid_content_type', message: 'Content-Type must be application/json' },
        requestId,
      });
    }

    // Express já aplicará limite de 32kb; mas cuidamos da resposta customizada via middleware global
    const validation = validatePayload(req.body);
    if (!validation.ok) {
      return res
        .status(400)
        .json({ error: { code: validation.code, message: validation.message }, requestId });
    }

    const { model, messages } = req.body;
    const content = await callAI(model, messages, Number(process.env.UPSTREAM_TIMEOUT_MS || 15000));
    const duration = Date.now() - start;
    logInfo('ai_chat_success', { requestId, duration });
    return res.status(200).json({ content, requestId });
  } catch (err: any) {
    const duration = Date.now() - start;
    const msg = String(err?.message || 'internal_error');
    if (msg.startsWith('upstream_timeout')) {
      logWarn('ai_chat_timeout', { requestId, duration });
      return res
        .status(500)
        .json({ error: { code: 'upstream_timeout', message: 'AI provider timeout' }, requestId });
    }
    if (msg.startsWith('upstream_rate_limited')) {
      logWarn('ai_chat_upstream_429', { requestId, duration });
      return res.status(500).json({
        error: { code: 'upstream_unavailable', message: 'AI provider rate limited' },
        requestId,
      });
    }
    logError('ai_chat_error', { requestId, duration, error: msg.slice(0, 200) });
    return res
      .status(500)
      .json({ error: { code: 'internal_error', message: 'Internal error' }, requestId });
  }
}

function logInfo(operation: string, extra: Record<string, unknown>) {
  console.log(JSON.stringify({ level: 30, ts: new Date().toISOString(), operation, ...extra }));
}
function logWarn(operation: string, extra: Record<string, unknown>) {
  console.warn(JSON.stringify({ level: 40, ts: new Date().toISOString(), operation, ...extra }));
}
function logError(operation: string, extra: Record<string, unknown>) {
  console.error(JSON.stringify({ level: 50, ts: new Date().toISOString(), operation, ...extra }));
}
