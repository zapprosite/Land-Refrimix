// Vercel Serverless Function — /api/ai/chat
import type { VercelRequest, VercelResponse } from '@vercel/node';

type ChatMessage = { sender: 'user' | 'bot'; text: string };

function rid(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function validate(body: any): { ok: true } | { ok: false; code: string; message: string } {
  if (!body || typeof body !== 'object') return { ok: false, code: 'invalid_payload', message: 'Body must be an object' };
  const { model, messages } = body;
  if (typeof model !== 'string' || model.length === 0) return { ok: false, code: 'invalid_payload', message: 'model is required' };
  if (!Array.isArray(messages)) return { ok: false, code: 'invalid_payload', message: 'messages must be an array' };
  if (messages.length < 1) return { ok: false, code: 'invalid_payload', message: 'messages must have at least 1 item' };
  if (messages.length > 25) return { ok: false, code: 'too_many_messages', message: 'messages max length is 25' };
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (!m || typeof m !== 'object') return { ok: false, code: 'invalid_payload', message: `messages[${i}] must be an object` };
    if (m.sender !== 'user' && m.sender !== 'bot') return { ok: false, code: 'invalid_payload', message: `messages[${i}].sender must be 'user' | 'bot'` };
    if (typeof m.text !== 'string') return { ok: false, code: 'invalid_payload', message: `messages[${i}].text must be string` };
    if (m.text.length < 1) return { ok: false, code: 'invalid_payload', message: `messages[${i}].text is required` };
    if (m.text.length > 1000) return { ok: false, code: 'message_too_long', message: `messages[${i}].text max length is 1000` };
  }
  return { ok: true };
}

async function callAI(model: string, messages: ChatMessage[], timeoutMs = 15_000): Promise<string> {
  if (process.env.AI_STUB === 'true' || !process.env.OPENAI_API_KEY) {
    const last = [...messages].reverse().find((m) => m.sender === 'user')?.text || '';
    return `Assistente HVAC-R: posso ajudar a dimensionar e indicar modelos. ${last ? `Sobre: "${last}"` : ''}`.trim();
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const payload = {
      model,
      messages: [
        { role: 'system', content: 'Você é um assistente HVAC-R' },
        ...messages.map((m) => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })),
      ],
      temperature: 0.4,
    };
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    } as any);
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error('upstream_error:' + text);
    }
    const data: any = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') throw new Error('upstream_invalid_response');
    return content.trim();
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('upstream_timeout');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = (req.headers['x-request-id'] as string) || rid();
  res.setHeader('X-Request-Id', requestId);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cache-Control', 'no-store');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: { code: 'method_not_allowed', message: 'Use POST' }, requestId });
  }
  if (!req.headers['content-type']?.toString().includes('application/json')) {
    return res.status(400).json({ error: { code: 'invalid_content_type', message: 'Content-Type must be application/json' }, requestId });
  }
  // Auth opcional
  const required = process.env.REQUIRE_AUTH === 'true' && !!process.env.SERVICE_API_KEY;
  if (required) {
    const auth = req.headers['authorization'] || '';
    if (auth !== `Bearer ${process.env.SERVICE_API_KEY}`) {
      return res.status(401).json({ error: { code: 'unauthorized', message: 'Missing or invalid credentials' }, requestId });
    }
  }
  try {
    const body = req.body ?? {};
    const valid = validate(body);
    if (!(valid as any).ok) {
      const v = valid as any;
      return res.status(400).json({ error: { code: v.code, message: v.message }, requestId });
    }
    const { model, messages } = body as { model: string; messages: ChatMessage[] };
    const content = await callAI(model, messages, Number(process.env.UPSTREAM_TIMEOUT_MS || 15000));
    return res.status(200).json({ content, requestId });
  } catch (err: any) {
    const msg = String(err?.message || 'internal_error');
    if (msg.startsWith('upstream_timeout')) {
      return res.status(500).json({ error: { code: 'upstream_timeout', message: 'AI provider timeout' }, requestId });
    }
    return res.status(500).json({ error: { code: 'internal_error', message: 'Internal error' }, requestId });
  }
}

