import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import QuickActions from '@/components/dashboard/QuickActions';
import { dashboardStats } from '@/data/mockData';
import { Users, GraduationCap, Calendar, ShoppingBag, DollarSign, Thermometer, Bus, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const activityData = [
  { name: 'Mon', users: 400, bookings: 24, orders: 45 },
  { name: 'Tue', users: 300, bookings: 18, orders: 38 },
  { name: 'Wed', users: 520, bookings: 32, orders: 62 },
  { name: 'Thu', users: 480, bookings: 28, orders: 55 },
  { name: 'Fri', users: 600, bookings: 45, orders: 78 },
  { name: 'Sat', users: 350, bookings: 12, orders: 25 },
  { name: 'Sun', users: 280, bookings: 8, orders: 18 },
];

const enrollmentData = [
  { month: 'Jan', engineering: 320, medical: 180 },
  { month: 'Feb', engineering: 350, medical: 195 },
  { month: 'Mar', engineering: 380, medical: 210 },
  { month: 'Apr', engineering: 420, medical: 235 },
  { month: 'May', engineering: 450, medical: 250 },
  { month: 'Jun', engineering: 480, medical: 275 },
];

const Dashboard: React.FC = () => {
  const { profile, currentTenant } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="animate-slide-up">
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {profile?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening in the <span className="capitalize font-medium text-foreground">{currentTenant}</span> faculty today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={dashboardStats.totalStudents.toLocaleString()}
          change={{ value: 12, type: 'increase' }}
          icon={Users}
          delay={0}
        />
        <StatCard
          title="Active Teachers"
          value={dashboardStats.totalTeachers}
          change={{ value: 5, type: 'increase' }}
          icon={GraduationCap}
          delay={100}
        />
        <StatCard
          title="Rooms Booked"
          value={dashboardStats.roomsBooked}
          change={{ value: 8, type: 'increase' }}
          icon={Calendar}
          delay={200}
        />
        <StatCard
          title="Orders Today"
          value={dashboardStats.ordersToday}
          change={{ value: 15, type: 'increase' }}
          icon={ShoppingBag}
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card animate-slide-up" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--accent))"
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card animate-slide-up" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Enrollment by Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={enrollmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="engineering" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="medical" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <QuickActions />
      </div>
    </div>
  );
};

export default Dashboard;
