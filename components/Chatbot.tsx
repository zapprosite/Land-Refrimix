import React, { useState, useEffect, useRef } from 'react';
import { createChatMessage } from '../services/api';
import { chatWithAI } from '../services/ai';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const WHATSAPP_NUMBER = '5513974139382';
  const MEMORY_TTL_MS = 2 * 60 * 60 * 1000; // 2 horas de memória curta
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Olá! Sou o Gelão, especialista HVAC-R da Refrimix no Brasil. Posso orientar instalação, manutenção preventiva/corretiva de climatização e refrigeração. Diga seu equipamento e problema e posso estimar o serviço e encaminhar para nosso atendimento.',
      sender: 'bot',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  // Persist session id across reloads
  const [sessionId] = useState(() => {
    try {
      const existing = localStorage.getItem('chat_session_id');
      if (existing) return existing;
      const sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat_session_id', sid);
      return sid;
    } catch {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Carregar e persistir mensagens por sessão (sem dependência de IP externo), com TTL curto
  useEffect(() => {
    try {
      const key = `chat_messages_session_${sessionId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.messages)) {
          const ts = Number(parsed.ts) || 0;
          if (Date.now() - ts < MEMORY_TTL_MS) {
            setMessages(parsed.messages as Message[]);
          } else {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (err) {
      console.warn('Falha ao carregar histórico do chat por sessão:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    try {
      const key = `chat_messages_session_${sessionId}`;
      const payload = JSON.stringify({ messages, ts: Date.now() });
      localStorage.setItem(key, payload);
    } catch (err) {
      console.warn('Falha ao salvar histórico do chat por sessão:', err);
    }
  }, [messages, sessionId]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(`chat_messages_session_${sessionId}`);
      localStorage.removeItem('chat_session_id');
    } catch {}
    setMessages([
      {
        id: Date.now(),
        text: 'Olá! Sou o Gelão, especialista HVAC-R da Refrimix no Brasil. Posso orientar instalação, manutenção preventiva/corretiva de climatização e refrigeração. Diga seu equipamento e problema e posso estimar o serviço e encaminhar para nosso atendimento.',
        sender: 'bot',
      },
    ]);
  };

  const buildWhatsAppText = () => {
    const lastBot = [...messages].reverse().find((m) => m.sender === 'bot');
    const summary = lastBot
      ? lastBot.text.slice(0, 200)
      : 'Orientação de compra de ar condicionado.';
    return `Vim do seu site. Sessão: ${sessionId}. Resumo: ${summary}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    // Tenta salvar a mensagem do usuário, mas não bloqueia o fluxo se falhar
    try {
      await createChatMessage({ session_id: sessionId, text: currentInput, sender: 'user' });
    } catch (err) {
      console.warn(
        'Falha ao salvar mensagem do usuário (Supabase offline ou tabela ausente):',
        err,
      );
    }

    // Tenta obter resposta da IA; se indisponível, usa fallback
    let botText = '';
    try {
      const history = [...messages, userMessage].map((m) => ({ sender: m.sender, text: m.text }));
      botText = await chatWithAI(sessionId, history);
    } catch (err) {
      console.warn('AI indisponível, usando resposta padrão:', err);
      botText =
        'Posso orientar serviços HVAC-R (split, VRF, refrigeração comercial). Deseja agendar? Atendimento imediato via WhatsApp: +55 13 97413-9382.';
    }

    const botResponse: Message = {
      id: Date.now() + 1,
      text: botText,
      sender: 'bot',
    };
    setMessages((prev) => [...prev, botResponse]);

    // Tenta salvar a resposta do bot, mas não bloqueia o fluxo se falhar
    try {
      await createChatMessage({ session_id: sessionId, text: botText, sender: 'bot' });
    } catch (err) {
      console.warn('Falha ao salvar resposta do bot:', err);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`
                    w-80 h-[28rem] bg-light-bg dark:bg-dark-bg rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out
                    ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
                `}
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div className="bg-brand-primary text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-robot text-2xl mr-3"></i>
            <h3 className="font-bold text-lg">Gelão Assistant</h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppText())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold text-white px-3 py-1 rounded-md hover:opacity-90 inline-flex items-center gap-2"
              aria-label="Atendimento WhatsApp"
              onClick={clearHistory}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  fill="currentColor"
                  d="M12,2 C6.5,2 2,6.5 2,12 C2,13.9 2.5,15.7 3.4,17.2 L2,22 L6.8,20.6 C8.3,21.5 10.1,22 12,22 C17.5,22 22,17.5 22,12 C22,6.5 17.5,2 12,2 Z M16.3,13.4 C15.7,13.1 15.2,13 14.8,13.5 C14.3,14.1 13.7,14.8 13.2,14.9 C12.8,15 12.3,14.7 11.7,14.4 C10.5,13.8 9.5,12.9 8.7,11.8 C8.4,11.4 8.1,10.9 8.3,10.4 C8.5,9.9 9.1,9.4 9.5,8.9 C9.7,8.6 9.7,8.2 9.5,7.8 C9.2,7.3 8.7,6.2 8.2,6.1 C7.8,6 7.4,6.1 7,6.3 C6.1,6.8 5.5,7.8 5.5,8.9 C5.5,9.6 5.7,10.3 6.1,10.9 C6.8,12.1 7.7,13.2 8.8,14.2 C10,15.3 11.3,16.1 12.8,16.7 C13.5,17 14.2,17.2 14.9,17.2 C16,17.2 16.9,16.8 17.5,16 C17.8,15.6 18,15.1 17.9,14.7 C17.8,14.3 17,13.8 16.3,13.4 Z"
                />
              </svg>
              WhatsApp
            </a>
            <button
              onClick={clearHistory}
              className="bg-brand-grey text-brand-black px-3 py-1 rounded-md hover:opacity-90"
              aria-label="Encerrar atendimento"
            >
              Encerrar
            </button>
            <button
              onClick={toggleChat}
              className="text-xl hover:opacity-80"
              aria-label="Fechar chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
            >
              <div
                className={`
                                    max-w-[80%] p-3 rounded-lg shadow
                                    ${
                                      msg.sender === 'user'
                                        ? 'bg-brand-gold text-white rounded-br-none'
                                        : 'bg-brand-grey text-light-fg dark:text-dark-bg rounded-bl-none'
                                    }
                                `}
                data-msg={msg.sender}
                aria-label={
                  msg.sender === 'user' ? 'Mensagem do usuário' : 'Mensagem do assistente'
                }
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-light-border dark:border-dark-border">
          <form onSubmit={handleSendMessage} className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="w-full py-2 px-3 rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-gold"
              aria-label="Mensagem"
            />
            <button
              type="submit"
              className="ml-3 text-brand-gold text-2xl hover:opacity-80 transition-opacity"
              aria-label="Enviar mensagem"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={toggleChat}
        className="bg-brand-primary h-16 w-16 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-brand-gold transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat com Gelão'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <i className="fas fa-times text-2xl"></i>
        ) : (
          <i className="fas fa-robot text-2xl"></i>
        )}
      </button>
    </div>
  );
};

export default Chatbot;
