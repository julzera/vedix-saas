import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Moon, Sun, Code, Layout } from 'lucide-react';
import Button from '../../components/ui/Button';

const WorkspaceLayout = () => {
  // Inicializa o tema buscando do localStorage para persistência
  const [theme, setTheme] = useState(localStorage.getItem('vixel_theme') || 'light');
  const location = useLocation();
  
  // Extrai o nome da página atual para o Breadcrumb (Ex: /workspace/editor -> EDITOR)
  const segments = location.pathname.split('/');
  const pageName = segments[segments.length - 1] || 'Dashboard';

  // Efeito para aplicar o tema no elemento raiz (HTML)
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove temas anteriores
    root.classList.remove('light', 'dark');
    root.setAttribute('data-theme', theme);
    
    // Adiciona a classe atual (importante para o Tailwind dark mode 'class')
    root.classList.add(theme);
    
    // Salva a preferência do usuário
    localStorage.setItem('vixel_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="flex h-screen w-full bg-bg-app transition-colors duration-300 overflow-hidden">
      {/* Menu Lateral Fixo */}
      <Sidebar />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Profissional */}
        <header 
          className="h-[70px] border-b border-border flex items-center justify-between px-8 z-20 shadow-sm transition-colors duration-300" 
          style={{ backgroundColor: 'var(--surface)' }}
        >
          {/* Breadcrumbs / Page Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Layout size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Workspace</span>
              <h2 className="text-sm font-bold text-text-primary uppercase tracking-tight">
                {pageName === 'workspace' ? 'Visão Geral' : pageName}
              </h2>
            </div>
          </div>

          {/* Actions - Theme Toggle & API Docs */}
          <div className="flex items-center gap-3">
            {/* Theme Switcher */}
            <button 
              onClick={toggleTheme}
              title={`Alternar para modo ${theme === 'light' ? 'Escuro' : 'Claro'}`}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-text-secondary hover:text-primary hover:bg-primary/10 transition-all active:scale-90"
            >
              {theme === 'light' ? (
                <Moon size={20} className="animate-in zoom-in duration-300" />
              ) : (
                <Sun size={20} className="animate-in zoom-in duration-300 text-yellow-500" />
              )}
            </button>

            {/* API Button */}
            <Button variant="outline" className="h-10 text-xs hidden sm:flex border-gray-200 dark:border-slate-700">
              <Code size={16} /> 
              <span className="ml-1">Documentação API</span>
            </Button>
            
            {/* User Avatar Placeholder */}
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/20">
              AD
            </div>
          </div>
        </header>

        {/* Área de Conteúdo Dinâmico */}
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default WorkspaceLayout;