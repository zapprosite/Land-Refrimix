export type ChatMessage = { sender: 'user' | 'bot'; text: string };

export function validatePayload(
  body: any,
): { ok: true } | { ok: false; code: string; message: string } {
  if (!body || typeof body !== 'object')
    return { ok: false, code: 'invalid_payload', message: 'Body must be an object' };
  const { model, messages } = body;
  if (typeof model !== 'string' || model.length === 0)
    return { ok: false, code: 'invalid_payload', message: 'model is required' };
  if (!Array.isArray(messages))
    return { ok: false, code: 'invalid_payload', message: 'messages must be an array' };
  if (messages.length < 1)
    return { ok: false, code: 'invalid_payload', message: 'messages must have at least 1 item' };
  if (messages.length > 25)
    return { ok: false, code: 'too_many_messages', message: 'messages max length is 25' };
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (!m || typeof m !== 'object')
      return { ok: false, code: 'invalid_payload', message: `messages[${i}] must be an object` };
    if (m.sender !== 'user' && m.sender !== 'bot')
      return {
        ok: false,
        code: 'invalid_payload',
        message: `messages[${i}].sender must be 'user' | 'bot'`,
      };
    if (typeof m.text !== 'string')
      return { ok: false, code: 'invalid_payload', message: `messages[${i}].text must be string` };
    if (m.text.length < 1)
      return { ok: false, code: 'invalid_payload', message: `messages[${i}].text is required` };
    if (m.text.length > 1000)
      return {
        ok: false,
        code: 'message_too_long',
        message: `messages[${i}].text max length is 1000`,
      };
  }
  return { ok: true };
}
