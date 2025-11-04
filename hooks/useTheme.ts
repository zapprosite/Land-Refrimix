
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const localTheme = localStorage.getItem('theme') as Theme;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (localTheme) {
            setTheme(localTheme);
            document.documentElement.classList.toggle('dark', localTheme === 'dark');
        } else if (prefersDark) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        } else {
            setTheme('light');
             document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return [theme, toggleTheme];
};
