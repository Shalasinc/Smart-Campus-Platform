import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Building2, 
  Calendar, 
  ShoppingBag, 
  GraduationCap, 
  Cpu, 
  Bus, 
  ArrowRight,
  Users,
  Shield,
  Zap,
  Globe
} from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Room Booking',
      description: 'Reserve classrooms, labs, and meeting rooms with real-time availability.',
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Buy and sell textbooks, equipment, and supplies within the university.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      icon: GraduationCap,
      title: 'E-Learning',
      description: 'Access courses and take online exams with smart proctoring.',
      color: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-500',
    },
    {
      icon: Cpu,
      title: 'IoT Dashboard',
      description: 'Monitor campus sensors for temperature, air quality, and occupancy.',
      color: 'from-orange-500/20 to-orange-500/5',
      iconColor: 'text-orange-500',
    },
    {
      icon: Bus,
      title: 'Shuttle Tracking',
      description: 'Real-time GPS tracking of campus shuttles with ETA predictions.',
      color: 'from-rose-500/20 to-rose-500/5',
      iconColor: 'text-rose-500',
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Role-based access control for students, teachers, and admins.',
      color: 'from-slate-500/20 to-slate-500/5',
      iconColor: 'text-slate-500',
    },
  ];

  const stats = [
    { value: '2,450+', label: 'Active Students' },
    { value: '185', label: 'Faculty Members' },
    { value: '50+', label: 'Smart Classrooms' },
    { value: '99.9%', label: 'System Uptime' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-accent" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 backdrop-blur-sm">
              🎓 Microservices Architecture • Multi-Tenant • Event-Driven
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
              Smart University
              <span className="block gradient-text bg-gradient-to-r from-primary-foreground to-primary-foreground/70">
                Management Platform
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              A comprehensive platform for modern universities featuring room booking, 
              marketplace, e-learning, IoT monitoring, and real-time shuttle tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="xl" 
                variant="glass"
                onClick={() => navigate('/auth')}
                className="group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="xl" 
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 container mx-auto px-4">
        <Card className="glass-card border-0 shadow-xl">
          <CardContent className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete suite of tools designed for modern educational institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="glass-card hover-lift overflow-hidden animate-slide-up group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-muted mb-4 ${feature.iconColor}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Architecture</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Scale & Reliability
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade microservices architecture with industry best practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card text-center p-8 animate-slide-up">
              <Zap className="h-12 w-12 mx-auto mb-4 text-sidebar-primary" />
              <h3 className="text-xl font-semibold mb-2">Saga Pattern</h3>
              <p className="text-muted-foreground">
                Distributed transactions across marketplace, inventory, and payment services
              </p>
            </Card>
            
            <Card className="glass-card text-center p-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <Shield className="h-12 w-12 mx-auto mb-4 text-sidebar-primary" />
              <h3 className="text-xl font-semibold mb-2">Circuit Breaker</h3>
              <p className="text-muted-foreground">
                Fault-tolerant notification system with automatic recovery
              </p>
            </Card>
            
            <Card className="glass-card text-center p-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Globe className="h-12 w-12 mx-auto mb-4 text-sidebar-primary" />
              <h3 className="text-xl font-semibold mb-2">Multi-Tenant</h3>
              <p className="text-muted-foreground">
                Isolated data per faculty with schema-per-tenant design
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          
          <CardContent className="relative z-10 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-lg mb-6">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your Campus?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join the future of university management with our smart platform.
            </p>
            <Button 
              size="xl" 
              variant="glass"
              onClick={() => navigate('/auth')}
              className="group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">SmartUni</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 SmartUni Platform. Built with microservices architecture.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
