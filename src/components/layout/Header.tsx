import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockNotifications } from '@/data/mockData';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { user, profile, currentTenant, setCurrentTenant } = useAuth();
  const unreadNotifications = mockNotifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      {/* Tenant Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden md:flex gap-2">
            {currentTenant === 'engineering' ? '🏗️' : '🏥'}
            <span className="capitalize">{currentTenant}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Switch Faculty</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCurrentTenant('engineering')}>
            🏗️ Engineering Faculty
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCurrentTenant('medical')}>
            🏥 Medical Faculty
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            <Badge variant="secondary" className="text-xs">
              {unreadNotifications} new
            </Badge>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {mockNotifications.slice(0, 3).map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
              <div className="flex items-center gap-2 w-full">
                <span className={`h-2 w-2 rounded-full ${notification.read ? 'bg-muted' : 'bg-sidebar-primary'}`} />
                <span className="font-medium text-sm">{notification.title}</span>
              </div>
              <p className="text-xs text-muted-foreground pl-4">{notification.message}</p>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center justify-center text-sidebar-primary font-medium">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Avatar */}
      {user && profile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`}
                alt={profile.name}
                className="h-8 w-8 rounded-full ring-2 ring-border"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{profile.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export default Header;
