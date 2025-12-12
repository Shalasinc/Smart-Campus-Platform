import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockBookings, mockOrders, mockRooms } from '@/data/mockData';
import { Calendar, ShoppingBag, CheckCircle, Clock } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'booking',
      title: 'Room Booking Confirmed',
      description: `${mockRooms[0].name} booked for Study Group`,
      time: '2 hours ago',
      icon: Calendar,
      status: 'success',
    },
    {
      id: 2,
      type: 'order',
      title: 'New Order Placed',
      description: 'Engineering Textbook + Scientific Calculator',
      time: '4 hours ago',
      icon: ShoppingBag,
      status: 'processing',
    },
    {
      id: 3,
      type: 'exam',
      title: 'Exam Submission',
      description: 'Data Structures Midterm submitted',
      time: '1 day ago',
      icon: CheckCircle,
      status: 'completed',
    },
    {
      id: 4,
      type: 'booking',
      title: 'Pending Approval',
      description: 'Computer Lab 101 booking request',
      time: '1 day ago',
      icon: Clock,
      status: 'pending',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
      case 'completed':
        return <Badge className="badge-success">Completed</Badge>;
      case 'processing':
        return <Badge className="badge-info">Processing</Badge>;
      case 'pending':
        return <Badge className="badge-warning">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="rounded-lg bg-muted p-2.5">
                <activity.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{activity.title}</p>
                  {getStatusBadge(activity.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
