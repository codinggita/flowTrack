import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const THEMES = {
  dark: {
    '--bg':'#0e1511','--nav':'#161d1a','--card':'#1a211d','--card-high':'#242c28',
    '--border':'#3c4a43','--border-hover':'#42e5b0','--text':'#dce4de','--muted':'#85948c',
    '--secondary':'#bbcac1','--green':'#42e5b0','--green-dim':'#00c896','--red':'#ff4d4d',
    '--orange':'#ffbca2','--font-display':'Manrope, sans-serif','--font-body':'Inter, sans-serif',
    '--shadow':'none','--overlay':'rgba(0,0,0,0.72)',
  },
  light: {
    '--bg':'#f0f4f2','--nav':'#ffffff','--card':'#ffffff','--card-high':'#f5f8f6',
    '--border':'#d1dbd6','--border-hover':'#00a878','--text':'#0d1f18','--muted':'#5a7268',
    '--secondary':'#2d4a3e','--green':'#00a878','--green-dim':'#007a58','--red':'#d63031',
    '--orange':'#e17055','--font-display':'Manrope, sans-serif','--font-body':'Inter, sans-serif',
    '--shadow':'0 1px 3px rgba(0,0,0,0.08)','--overlay':'rgba(0,0,0,0.5)',
  },
};

export function ThemeProvider({ children }) {
  const getInitialTheme = () => {
    const saved = localStorage.getItem('ft_theme');
    if (saved && ['dark','light','system'].includes(saved)) return saved;
    return 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  const resolveTheme = useCallback((t) => {
    if (t === 'system') return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    return t;
  }, []);

  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(getInitialTheme()));

  const applyTheme = useCallback((resolved) => {
    const root = document.documentElement;
    const tokens = THEMES[resolved] || THEMES.dark;
    Object.entries(tokens).forEach(([key, value]) => root.style.setProperty(key, value));
    root.setAttribute('data-theme', resolved);
    document.body.style.background = tokens['--bg'];
    document.body.style.color = tokens['--text'];
  }, []);

  const changeTheme = useCallback((newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('ft_theme', newTheme);
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [resolveTheme, applyTheme]);

  useEffect(() => {
    const resolved = resolveTheme(theme);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => {
      if (theme === 'system') {
        const resolved = resolveTheme('system');
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme, resolveTheme, applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, changeTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
