import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title = 'Dashboard' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <Header title={title} onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
