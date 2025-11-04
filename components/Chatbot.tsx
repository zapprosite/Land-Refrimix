import React, { useState, useEffect, useRef } from 'react';
import { createChatMessage } from '../services/api';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Olá! Eu sou o Gelão, seu assistente virtual da Refrimix. Como posso ajudar?", sender: 'bot' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
        };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = inputValue;
        setInputValue('');

        try {
            await createChatMessage({ session_id: sessionId, text: currentInput, sender: 'user' });

            // Simulate bot response
            setTimeout(async () => {
                const botResponseText = "Entendido! Nossos especialistas analisarão sua mensagem. Para agilizar, qual o melhor horário para contato?";
                const botResponse: Message = {
                    id: Date.now() + 1,
                    text: botResponseText,
                    sender: 'bot',
                };
                setMessages(prev => [...prev, botResponse]);
                await createChatMessage({ session_id: sessionId, text: botResponseText, sender: 'bot' });
            }, 1200);

        } catch (error) {
            console.error("Erro ao salvar mensagem do chat:", error);
             const errorResponse: Message = {
                id: Date.now() + 1,
                text: "Desculpe, estou com problemas para me conectar. Tente novamente mais tarde.",
                sender: 'bot',
            };
            setMessages(prev => [...prev, errorResponse]);
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
                    <button onClick={toggleChat} className="text-xl hover:opacity-80" aria-label="Fechar chat">
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div
                                className={`
                                    max-w-[80%] p-3 rounded-lg shadow
                                    ${msg.sender === 'user' 
                                        ? 'bg-brand-gold text-white rounded-br-none' 
                                        : 'bg-brand-grey text-light-fg dark:text-dark-bg rounded-bl-none'}
                                `}
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
                        <button type="submit" className="ml-3 text-brand-gold text-2xl hover:opacity-80 transition-opacity" aria-label="Enviar mensagem">
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>

            <button
                onClick={toggleChat}
                className="bg-brand-primary h-16 w-16 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-brand-gold transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold"
                aria-label={isOpen ? "Fechar chat" : "Abrir chat com Gelão"}
                aria-expanded={isOpen}
            >
                {isOpen ? <i className="fas fa-times text-2xl"></i> : <i className="fas fa-robot text-2xl"></i>}
            </button>
        </div>
    );
};

export default Chatbot;
