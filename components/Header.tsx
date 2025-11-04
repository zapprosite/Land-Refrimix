import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const { session, signOut } = useAuth();
    
    return (
        <header className="sticky top-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-sm shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-primary dark:text-brand-white">
                    Refrimix <span className="text-brand-gold">Tecnologia</span>
                </h1>
                <nav className="hidden md:flex items-center space-x-8">
                    <a href="#beneficios" className="hover:text-brand-gold transition-colors">Benefícios</a>
                    <a href="#portfolio" className="hover:text-brand-gold transition-colors">Portfólio</a>
                    <a href="#servicos" className="hover:text-brand-gold transition-colors">Serviços</a>
                    {session ? (
                         <button onClick={signOut} className="bg-brand-gold text-brand-black font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
                            Sair
                         </button>
                    ) : (
                         <a href="#contato" className="bg-brand-gold text-brand-black font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
                            Fale Conosco
                        </a>
                    )}
                </nav>
                <div className="flex items-center">
                    {session && (
                        <span className="hidden sm:inline mr-4 text-sm">{session.user.email}</span>
                    )}
                     <div className="md:hidden mr-4">
                        <button className="text-light-fg dark:text-dark-fg" aria-label="Abrir menu">
                           <i className="fas fa-bars text-2xl"></i>
                        </button>
                    </div>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
