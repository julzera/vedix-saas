import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Image, Settings, LogOut } from 'lucide-react'; // Instale: npm i lucide-react (Ícones modernos)

// Se não quiser instalar lucide agora, use seus SVGs antigos, mas recomendo lucide para padronizar.
// Vou usar Lucide no exemplo para ficar limpo.

const Sidebar = () => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/workspace/dashboard' },
    { icon: Image, label: 'Editor', path: '/workspace/editor' },
    { icon: Settings, label: 'Configurações', path: '/workspace/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('vixel_auth');
    window.location.href = '/login';
  };

  return (
    <aside className="w-[260px] bg-bg-surface border-r border-border flex flex-col p-6 h-screen sticky top-0" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="mb-10">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
          Vixel<span className="text-primary">.ai</span>
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
              ${isActive 
                ? 'bg-primary-light text-primary font-bold' 
                : 'text-text-secondary hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-primary'}
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button 
        onClick={handleLogout} 
        className="mt-auto flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
      >
        <LogOut size={20} />
        Sair
      </button>
    </aside>
  );
};

export default Sidebar;