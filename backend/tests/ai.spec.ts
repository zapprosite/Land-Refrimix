import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

const server = app;

describe('Infra e Headers', () => {
  it('GET /health retorna 200 e headers de segurança', async () => {
    process.env.NODE_ENV = 'production';
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBe('DENY');
    expect(res.headers['strict-transport-security']).toBeTruthy();
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('GET / retorna 200 texto simples', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Refrimix Backend Online');
  });
});

describe('POST /api/ai/chat', () => {
  it('200 - retorna conteúdo válido', async () => {
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'Olá' }] });
    expect(res.status).toBe(200);
    expect(typeof res.body.content).toBe('string');
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('401 - require auth sem credenciais', async () => {
    process.env.REQUIRE_AUTH = 'true';
    process.env.SERVICE_API_KEY = 'top';
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'Olá' }] });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('unauthorized');
    // reset
    process.env.REQUIRE_AUTH = 'false';
    delete process.env.SERVICE_API_KEY;
  });

  it('200 - require auth com credenciais', async () => {
    process.env.REQUIRE_AUTH = 'true';
    process.env.SERVICE_API_KEY = 'top';
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Authorization', 'Bearer top')
      .set('Content-Type', 'application/json')
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'Olá' }] });
    expect(res.status).toBe(200);
    // reset
    process.env.REQUIRE_AUTH = 'false';
    delete process.env.SERVICE_API_KEY;
  });

  it('400 - invalid_content_type', async () => {
    const res = await request(server).post('/api/ai/chat').send('not-json');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_content_type');
  });

  it('400 - invalid_json', async () => {
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .send('{ invalid json');
    // Express json parser com erro gera nosso middleware de invalid_json
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_json');
  });

  it('400 - payload_too_large (>32KB)', async () => {
    const big = 'a'.repeat(33 * 1024);
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      // Envia um campo extra grande para estourar o limite do body-parser
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'x' }], extra: big });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('payload_too_large');
  });

  it('400 - invalid_payload (messages vazio)', async () => {
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .send({ model: 'gpt-4o-mini', messages: [] });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('invalid_payload');
  });

  it('400 - too_many_messages', async () => {
    const msgs = Array.from({ length: 26 }, () => ({ sender: 'user' as const, text: 'x' }));
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .send({ model: 'gpt-4o-mini', messages: msgs });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('too_many_messages');
  });

  it('429 - rate limit', async () => {
    // Constrói > max por janela
    const max = 5;
    process.env.RATE_LIMIT_MAX = String(max);
    const reqs = [];
    for (let i = 0; i < max + 1; i++) {
      reqs.push(
        request(server)
          .post('/api/ai/chat')
          .set('Content-Type', 'application/json')
          .set('x-test-client', 'client-A')
          .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'a' }] }),
      );
    }
    const results = await Promise.all(reqs);
    const has429 = results.some((r) => r.status === 429);
    expect(has429).toBe(true);
  });

  it('500 - upstream timeout', async () => {
    // Força timeout simulando chamada real com UPSTREAM_TIMEOUT_MS muito baixo e sem stub
    process.env.RATE_LIMIT_MAX = '1000';
    process.env.AI_STUB = 'false';
    process.env.OPENAI_API_KEY = 'dummy';
    process.env.UPSTREAM_TIMEOUT_MS = '1';
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .set('x-test-client', 'client-B')
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'teste' }] });
    expect(res.status).toBe(500);
    expect(['upstream_timeout', 'internal_error']).toContain(res.body.error.code);
    // Reset stub para demais testes
    process.env.AI_STUB = 'true';
    delete process.env.OPENAI_API_KEY;
    delete process.env.UPSTREAM_TIMEOUT_MS;
  });

  it('500 - unsupported_provider', async () => {
    process.env.RATE_LIMIT_MAX = '1000';
    process.env.AI_STUB = 'false';
    process.env.AI_PROVIDER = 'other';
    process.env.OPENAI_API_KEY = 'dummy';
    const res = await request(server)
      .post('/api/ai/chat')
      .set('Content-Type', 'application/json')
      .set('x-test-client', 'client-C')
      .send({ model: 'gpt-4o-mini', messages: [{ sender: 'user', text: 'teste' }] });
    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('internal_error');
    // reset
    delete process.env.AI_PROVIDER;
    delete process.env.OPENAI_API_KEY;
    process.env.AI_STUB = 'true';
  });
});
