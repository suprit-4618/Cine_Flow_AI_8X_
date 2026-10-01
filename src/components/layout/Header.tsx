import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Clapperboard, Film, History, Compass } from 'lucide-react';
import { PrototypeBadge } from '../common/PrototypeBadge';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Studio', icon: Clapperboard },
    { to: '/storyboard', label: 'Storyboard', icon: Film },
    { to: '/history', label: 'History', icon: History },
    { to: '/explore', label: 'Explore', icon: Compass },
  ];

  return (
    <>
      {/* Accessible skip-to-content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-cine-border bg-obsidian/95 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Minimal Wordmark */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group p-1 focus:outline-none focus:ring-2 focus:ring-accent rounded-lg"
            aria-label="CineFlow AI Home"
          >
            <div className="w-8 h-8 rounded-xl bg-surface-raised border border-cine-border flex items-center justify-center text-accent shadow-sm group-hover:scale-105 transition-transform">
              <Clapperboard className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-text-primary group-hover:text-accent transition-colors">
              CineFlow
            </span>
          </NavLink>

          {/* Desktop Quiet Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-dark/90 p-1.5 rounded-xl border border-cine-border" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                    isActive
                      ? 'bg-surface-raised text-text-primary border border-cine-border shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-hover/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-accent' : 'text-text-dim'}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Persistent Prototype Tag */}
          <div className="flex items-center gap-3">
            <PrototypeBadge variant="subtle" />
          </div>
        </div>
      </header>
    </>
  );
};
