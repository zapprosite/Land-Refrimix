
import React from 'react';
import { useTheme } from '../hooks/useTheme';

const ThemeToggle: React.FC = () => {
    const [theme, toggleTheme] = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-brand-gold bg-light-card dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            aria-label="Alternar tema claro/escuro"
        >
            {theme === 'light' ? (
                <i className="fas fa-moon w-5 h-5"></i>
            ) : (
                <i className="fas fa-sun w-5 h-5"></i>
            )}
        </button>
    );
};

export default ThemeToggle;
