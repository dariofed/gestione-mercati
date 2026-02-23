import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, History, Settings } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: ShoppingBag, label: 'Vendita' },
    { path: '/history', icon: History, label: 'Storico' },
    { path: '/settings', icon: Settings, label: 'Impostazioni' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-2 border-stone-900 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-center gap-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              data-testid={`nav-${label.toLowerCase()}`}
              className={
                `flex items-center gap-2 px-6 py-2 rounded-xl border-2 border-stone-900 font-bold text-sm uppercase tracking-wide neo-button ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-900 hover:bg-stone-50'
                }`
              }
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;