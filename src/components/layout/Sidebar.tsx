import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShoppingBag,
  GraduationCap,
  Cpu,
  Bus,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const { user, profile, userRole, logout, currentTenant } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Room Booking', path: '/booking' },
    { icon: ShoppingBag, label: 'Marketplace', path: '/marketplace' },
    { icon: GraduationCap, label: 'E-Learning', path: '/learning' },
    { icon: Cpu, label: 'IoT Dashboard', path: '/iot' },
    { icon: Bus, label: 'Shuttle Tracking', path: '/shuttle' },
    { icon: Users, label: 'Users', path: '/users', adminOnly: true },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const filteredNav = navigationItems.filter(item => 
    !item.adminOnly || userRole === 'admin'
  );

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center w-full')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/80 shadow-lg shadow-sidebar-primary/20">
              <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div className="animate-fade-in">
                <h1 className="text-lg font-bold text-sidebar-foreground">SmartUni</h1>
                <p className="text-xs text-sidebar-foreground/60">Management Platform</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              'h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent',
              isCollapsed && 'absolute -right-3 top-6 bg-sidebar border border-sidebar-border rounded-full shadow-lg'
            )}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', isCollapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Tenant Selector */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <Badge variant="secondary" className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-medium">
              {currentTenant === 'engineering' ? '🏗️ Engineering Faculty' : '🏥 Medical Faculty'}
            </Badge>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-hide">
          <ul className="space-y-1">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={cn(
                      'nav-link',
                      isActive && 'active',
                      isCollapsed && 'justify-center px-0'
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'text-sidebar-primary')} />
                    {!isCollapsed && (
                      <span className="animate-fade-in">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          {user && profile && (
            <div className={cn('flex items-center gap-3', isCollapsed && 'justify-center')}>
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                alt={profile.name}
                className="h-10 w-10 rounded-full ring-2 ring-sidebar-primary/30"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 animate-fade-in">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{profile.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">{userRole || 'student'}</p>
                </div>
              )}
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="h-8 w-8 text-sidebar-foreground/60 hover:text-destructive hover:bg-destructive/10"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
