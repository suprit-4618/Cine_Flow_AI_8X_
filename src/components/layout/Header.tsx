import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Clapperboard, Film, History, Compass } from 'lucide-react';
import { PrototypeBadge } from '../common/PrototypeBadge';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Studio', icon: Clapperboard },
    { to: '/storyboard', label: '3-Shot Storyboard', icon: Film, badge: 'Original' },
    { to: '/history', label: 'My Creations', icon: History },
    { to: '/explore', label: 'Explore', icon: Compass },
  ];

  return (
    <>
      {/* Accessible skip-to-content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cine-amber focus:text-obsidian focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-cine-border bg-obsidian/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Wordmark */}
          <NavLink
            to="/"
            className="flex items-center gap-2.5 group focus-visible:rounded-lg p-1"
            aria-label="CineFlow AI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cine-amber to-amber-700 flex items-center justify-center shadow-amber-sm group-hover:scale-105 transition-transform">
              <Clapperboard className="w-5 h-5 text-obsidian" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-text-primary group-hover:text-cine-amber transition-colors">
                  CineFlow
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cine-amber/15 text-cine-amber border border-cine-amber/30 uppercase tracking-wider">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-text-dim tracking-wider uppercase hidden sm:inline">
                Cinematic Studio
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-dark/80 p-1.5 rounded-xl border border-cine-border" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all min-h-[44px] min-w-[44px] ${
                    isActive
                      ? 'bg-surface-raised text-text-primary border border-cine-border shadow-sm'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-hover'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cine-amber' : 'text-text-dim'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-cine-amber/20 text-cine-amber border border-cine-amber/40 ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Persistent Prototype Disclaimer Tag */}
          <div className="flex items-center gap-3">
            <PrototypeBadge variant="subtle" />
          </div>
        </div>
      </header>
    </>
  );
};
