import type { ChatMessage } from '../utils/validate';

export async function callAI(
  model: string,
  messages: ChatMessage[],
  timeoutMs = 15_000,
): Promise<string> {
  // Stub para DEV/Teste
  if (process.env.AI_STUB === 'true' || !process.env.OPENAI_API_KEY) {
    const last = [...messages].reverse().find((m) => m.sender === 'user')?.text || '';
    return `Assistente HVAC-R: posso ajudar a dimensionar e indicar modelos. ${last ? `Sobre: "${last}"` : ''}`.trim();
  }

  const provider = process.env.AI_PROVIDER || 'openai';
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    if (provider === 'openai') {
      const payload = {
        model,
        messages: [
          { role: 'system', content: 'Você é um assistente HVAC-R' },
          ...messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
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
        if (res.status === 429) throw new Error('upstream_rate_limited:' + text);
        throw new Error('upstream_error:' + text);
      }
      const data: any = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== 'string') throw new Error('upstream_invalid_response');
      return content.trim();
    }
    throw new Error('unsupported_provider');
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error('upstream_timeout');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
