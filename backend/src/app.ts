import express from 'express';
import cors from 'cors';
import { withRequestId } from './middlewares/requestId';
import { securityHeaders, noStore, requireAuthIfConfigured } from './middlewares/security';
import { rateLimit } from './middlewares/rateLimit';
import { postChat } from './routes/ai';

export const app = express();

// CORS allowlist por env
const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());
app.use(cors({ origin: origins, credentials: false }));

// Identidade e segurança
app.use(withRequestId);
app.use(securityHeaders);
app.use(noStore);

// Body parser + limite 32KB com tratamento: Express lança erro "entity.too.large"
app.use(express.json({ limit: '32kb' }));

// Middleware de erro de JSON / payload grande
app.use((err: any, _req: any, res: any, next: any) => {
  const requestId = res.getHeader('X-Request-Id') || '';
  if (err?.type === 'entity.too.large') {
    return res
      .status(400)
      .json({ error: { code: 'payload_too_large', message: 'Payload exceeds 32KB' }, requestId });
  }
  if (err instanceof SyntaxError) {
    return res
      .status(400)
      .json({ error: { code: 'invalid_json', message: 'Malformed JSON' }, requestId });
  }
  next(err);
});

// Rate limit na rota de chat (usa env dinâmico em cada request)
app.use('/api/ai/chat', rateLimit());

// Auth condicional
app.use('/api/ai/chat', requireAuthIfConfigured);

// Rota principal
app.post('/api/ai/chat', postChat);

// Healthcheck simples
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

// Raiz para verificação manual no navegador
app.get('/', (_req, res) => res.status(200).type('text/plain').send('Refrimix Backend Online'));
