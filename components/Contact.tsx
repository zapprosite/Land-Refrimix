import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createLead } from '../services/api';

const Contact: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    setStatus('sending');
    try {
      await createLead({ nome: formData.name, email: formData.email, mensagem: formData.message });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Falha ao enviar lead:', error);
      setStatus('error');
    }
  };

  return (
    <section id="contato" className="py-20 bg-light-card dark:bg-dark-card">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Entre em Contato</h2>
          <p className="text-lg text-light-fg/80 dark:text-dark-fg/80">
            Vamos climatizar o seu próximo grande projeto.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-light-bg dark:bg-dark-bg p-8 rounded-lg shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-gold"
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-medium">
                Mensagem
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-md bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-gold"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full md:w-auto bg-brand-gold text-brand-black font-bold py-3 px-12 rounded-lg text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-wait"
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </div>
            {status === 'success' && (
              <p className="text-center text-green-600 mt-4">
                Mensagem enviada com sucesso! Entraremos em contato em breve.
              </p>
            )}
            {status === 'error' && (
              <p className="text-center text-red-600 mt-4">
                Ocorreu um erro ao enviar a mensagem. Tente novamente.
              </p>
            )}
          </form>
          <div className="relative flex py-8 items-center">
            <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
            <span className="flex-shrink mx-4 text-gray-500">OU</span>
            <div className="flex-grow border-t border-light-border dark:border-dark-border"></div>
          </div>
          <div className="text-center">
            <button
              onClick={signInWithGoogle}
              className="w-full md:w-auto bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center mx-auto"
            >
              <i className="fab fa-google mr-3 text-red-500"></i> Agendar com Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
