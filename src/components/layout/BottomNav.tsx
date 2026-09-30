import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Clapperboard, Film, History, Compass } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Studio', icon: Clapperboard },
    { to: '/storyboard', label: '3-Shot', icon: Film, isOriginal: true },
    { to: '/history', label: 'History', icon: History },
    { to: '/explore', label: 'Explore', icon: Compass },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-dark/95 border-t border-cine-border backdrop-blur-lg px-2 py-1 safe-bottom"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-xs font-medium transition-colors min-h-[48px] ${
                isActive
                  ? 'text-cine-amber bg-surface-raised/80'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-cine-amber' : 'text-text-dim'}`} />
                {item.isOriginal && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-cine-amber" />
                )}
              </div>
              <span className="text-[11px] font-medium leading-none">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
