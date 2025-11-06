import {} from 'react';

type ChatRole = 'system' | 'user' | 'assistant';

interface OpenAIMessage {
  role: ChatRole;
  content: string;
}

interface ChatInputMessage {
  sender: 'user' | 'bot';
  text: string;
}

export async function chatWithAI(sessionId: string, history: ChatInputMessage[]): Promise<string> {
  const proxyUrl = (import.meta.env.VITE_AI_PROXY_URL as string | undefined)?.trim();
  const model = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini';
  const systemPrompt =
    (import.meta.env.VITE_AI_SYSTEM_PROMPT as string) ||
    [
      'Você é um assistente de vendas especializado em ar condicionado para consumidores finais.',
      'Objetivo: conduzir o cliente no processo de compra (onboarding e orientação), sem instruções técnicas de instalação.',
      'Abordagem consultiva: entenda necessidades (tamanho do ambiente, uso, preferências, ruído, budget).',
      'Guie por etapas: (1) levantar requisitos, (2) apresentar opções adequadas, (3) explicar benefícios e diferenciais,',
      '(4) orientar sobre eficiência energética e manutenção básica (limpeza de filtros, periodicidade de revisão).',
      'Técnicas de vendas: responda objeções comuns (preço, consumo, marca, garantia), crie senso de urgência quando apropriado (promoções, estoque),',
      'e ofereça upsell/cross-sell naturalmente (capacidade superior, inverter, purificação, Wi-Fi, instalação premium).',
      'Tom: profissional, acessível e claro; evite jargões técnicos complexos. Não forneça instruções detalhadas de instalação.',
      'Encerramento: reforce pós-venda (garantia, suporte) e encaminhe para atendimento WhatsApp com a mensagem "Vim do seu site" acompanhada de um breve resumo do que foi orientado.',
      'Se o cliente pedir instruções de instalação, explique que a instalação deve ser feita por profissional autorizado e foque na consultoria de compra.',
    ].join(' ');

  // Se não houver proxy configurado, usa resposta local simples (fallback seguro)
  if (!proxyUrl) {
    const lastUser = [...history].reverse().find((h) => h.sender === 'user')?.text || '';
    return `Sou o Gelão, especialista HVAC-R. Para te ajudar melhor, me diga o tamanho do ambiente, frequência de uso e se prefere inverter. ${lastUser ? `Sobre sua mensagem: "${lastUser}" — posso sugerir capacidades e modelos adequados.` : ''}`.trim();
  }

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((h) => ({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text })),
  ];

  const payload = {
    model,
    messages,
    temperature: 0.4,
  };

  const authHeader = (import.meta.env.VITE_AI_PROXY_AUTH as string | undefined)?.trim();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authHeader) headers['Authorization'] = authHeader;
  const res = await fetch(proxyUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${text}`);
  }

  const data = await res.json();
  // Tanto faz o formato, desde que retorne um "content" string
  const content = data?.choices?.[0]?.message?.content ?? data?.content;
  if (typeof content !== 'string') {
    throw new Error('Invalid AI proxy response');
  }
  return content.trim();
}
