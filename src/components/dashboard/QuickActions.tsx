import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Calendar, ShoppingCart, BookOpen, Cpu, Bus, Users } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Book a Room',
      icon: Calendar,
      path: '/booking',
      color: 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20',
    },
    {
      label: 'Browse Shop',
      icon: ShoppingCart,
      path: '/marketplace',
      color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
    },
    {
      label: 'Take Exam',
      icon: BookOpen,
      path: '/learning',
      color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
    },
    {
      label: 'View Sensors',
      icon: Cpu,
      path: '/iot',
      color: 'bg-orange-500/10 text-orange-600 hover:bg-orange-500/20',
    },
    {
      label: 'Track Shuttle',
      icon: Bus,
      path: '/shuttle',
      color: 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20',
    },
    {
      label: 'Manage Users',
      icon: Users,
      path: '/users',
      color: 'bg-slate-500/10 text-slate-600 hover:bg-slate-500/20',
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={action.path}
              variant="ghost"
              className={`h-auto flex-col gap-2 py-4 ${action.color} transition-all duration-200 animate-scale-in`}
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(action.path)}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
