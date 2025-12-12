import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useShuttles, useCreateShuttle, useUpdateShuttle, useDeleteShuttle, Shuttle } from '@/hooks/useShuttles';
import { useAuth } from '@/contexts/AuthContext';
import { Bus, MapPin, Clock, Navigation, RefreshCw, Gauge, Compass, Loader2, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ShuttlePage: React.FC = () => {
  const { data: shuttles, isLoading } = useShuttles();
  const { userRole } = useAuth();
  const isAdmin = userRole === 'admin';
  
  const createShuttle = useCreateShuttle();
  const updateShuttle = useUpdateShuttle();
  const deleteShuttle = useDeleteShuttle();

  const [selectedShuttle, setSelectedShuttle] = useState<Shuttle | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingShuttle, setEditingShuttle] = useState<Shuttle | null>(null);
  const [formData, setFormData] = useState({
    shuttle_id: '',
    name: '',
    route: '',
    next_stop: '',
    status: 'idle' as 'active' | 'idle' | 'maintenance',
    latitude: 40.712,
    longitude: -74.006,
    speed: 0,
    heading: 0,
    eta: 5,
  });

  useEffect(() => {
    if (shuttles) {
      setLastUpdated(new Date());
    }
  }, [shuttles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'idle':
        return 'badge-warning';
      case 'maintenance':
        return 'badge-destructive';
      default:
        return '';
    }
  };

  const getHeadingDirection = (heading: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(heading / 45) % 8;
    return directions[index];
  };

  const handleCreateShuttle = async () => {
    try {
      await createShuttle.mutateAsync(formData);
      toast({ title: 'Shuttle created successfully' });
      setCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Failed to create shuttle', variant: 'destructive' });
    }
  };

  const handleUpdateShuttle = async () => {
    if (!editingShuttle) return;
    try {
      await updateShuttle.mutateAsync({ id: editingShuttle.id, ...formData });
      toast({ title: 'Shuttle updated successfully' });
      setEditDialogOpen(false);
      setEditingShuttle(null);
      resetForm();
    } catch (error) {
      toast({ title: 'Failed to update shuttle', variant: 'destructive' });
    }
  };

  const handleDeleteShuttle = async (id: string) => {
    try {
      await deleteShuttle.mutateAsync(id);
      toast({ title: 'Shuttle deleted successfully' });
      if (selectedShuttle?.id === id) setSelectedShuttle(null);
    } catch (error) {
      toast({ title: 'Failed to delete shuttle', variant: 'destructive' });
    }
  };

  const openEditDialog = (shuttle: Shuttle) => {
    setEditingShuttle(shuttle);
    setFormData({
      shuttle_id: shuttle.shuttle_id,
      name: shuttle.name,
      route: shuttle.route,
      next_stop: shuttle.next_stop,
      status: shuttle.status,
      latitude: Number(shuttle.latitude),
      longitude: Number(shuttle.longitude),
      speed: Number(shuttle.speed),
      heading: shuttle.heading,
      eta: shuttle.eta,
    });
    setEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      shuttle_id: '',
      name: '',
      route: '',
      next_stop: '',
      status: 'idle',
      latitude: 40.712,
      longitude: -74.006,
      speed: 0,
      heading: 0,
      eta: 5,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ShuttleFormFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Shuttle ID</Label>
          <Input
            value={formData.shuttle_id}
            onChange={(e) => setFormData({ ...formData, shuttle_id: e.target.value })}
            placeholder="SH-001"
          />
        </div>
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Blue Route Express"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Route</Label>
          <Input
            value={formData.route}
            onChange={(e) => setFormData({ ...formData, route: e.target.value })}
            placeholder="Campus Loop"
          />
        </div>
        <div className="space-y-2">
          <Label>Next Stop</Label>
          <Input
            value={formData.next_stop}
            onChange={(e) => setFormData({ ...formData, next_stop: e.target.value })}
            placeholder="Engineering Building"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'active' | 'idle' | 'maintenance') => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="idle">Idle</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>ETA (minutes)</Label>
          <Input
            type="number"
            value={formData.eta}
            onChange={(e) => setFormData({ ...formData, eta: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label>Speed (km/h)</Label>
          <Input
            type="number"
            value={formData.speed}
            onChange={(e) => setFormData({ ...formData, speed: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Shuttle Tracking</h2>
          <p className="text-muted-foreground">Real-time location tracking of campus shuttles</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <RefreshCw className="h-3 w-3" />
            Last update: {lastUpdated.toLocaleTimeString()}
          </p>
          {isAdmin && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shuttle
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Shuttle</DialogTitle>
                  <DialogDescription>Create a new shuttle for tracking.</DialogDescription>
                </DialogHeader>
                <ShuttleFormFields />
                <Button onClick={handleCreateShuttle} disabled={createShuttle.isPending}>
                  {createShuttle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Create Shuttle
                </Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isAdmin && (
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Admin Mode:</span>
              <span className="text-muted-foreground">You can add, edit, and delete shuttles</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shuttle List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Active Shuttles</CardTitle>
              <CardDescription>{shuttles?.filter(s => s.status === 'active').length || 0} shuttles currently running</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {shuttles?.map((shuttle, index) => (
                <div
                  key={shuttle.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 animate-slide-up ${
                    selectedShuttle?.id === shuttle.id
                      ? 'bg-sidebar-primary/10 border border-sidebar-primary/30'
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedShuttle(shuttle)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-sidebar-primary/10 p-2">
                        <Bus className="h-5 w-5 text-sidebar-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{shuttle.name}</p>
                        <p className="text-sm text-muted-foreground">{shuttle.shuttle_id}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(shuttle.status)}>{shuttle.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="h-3 w-3" />
                      <span>{shuttle.route}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Gauge className="h-3 w-3" />
                      <span>{Number(shuttle.speed).toFixed(1)} km/h</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); openEditDialog(shuttle); }}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => { e.stopPropagation(); handleDeleteShuttle(shuttle.id); }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-success">{shuttles?.filter(s => s.status === 'active').length || 0}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-warning">{shuttles?.filter(s => s.status === 'idle').length || 0}</p>
              <p className="text-xs text-muted-foreground">Idle</p>
            </Card>
            <Card className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{shuttles?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </Card>
          </div>
        </div>

        {/* Map Area */}
        <div className="lg:col-span-2">
          <Card className="glass-card h-full min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-sidebar-primary" />
                Live Map
              </CardTitle>
              <CardDescription>
                Real-time shuttle positions on campus
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Simulated Map */}
              <div className="relative aspect-video bg-muted rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Campus buildings (simplified) */}
                <div className="absolute inset-8">
                  <div className="absolute top-1/4 left-1/4 w-20 h-16 bg-primary/20 rounded-lg flex items-center justify-center text-xs text-primary font-medium">
                    Engineering
                  </div>
                  <div className="absolute top-1/2 right-1/4 w-16 h-14 bg-accent/20 rounded-lg flex items-center justify-center text-xs text-accent font-medium">
                    Medical
                  </div>
                  <div className="absolute bottom-1/4 left-1/3 w-24 h-12 bg-success/20 rounded-lg flex items-center justify-center text-xs text-success font-medium">
                    Library
                  </div>
                  <div className="absolute top-1/3 right-1/3 w-16 h-10 bg-warning/20 rounded-lg flex items-center justify-center text-xs text-warning font-medium">
                    Cafeteria
                  </div>
                </div>

                {/* Shuttle markers */}
                {shuttles?.map((shuttle, index) => {
                  const x = 20 + (index * 25) + (Number(shuttle.longitude) - (-74.006)) * 10000;
                  const y = 20 + (index * 20) + (Number(shuttle.latitude) - 40.712) * 10000;
                  
                  return (
                    <div
                      key={shuttle.id}
                      className={`absolute transition-all duration-1000 ease-linear ${
                        selectedShuttle?.id === shuttle.id ? 'z-20' : 'z-10'
                      }`}
                      style={{
                        left: `${Math.min(85, Math.max(5, x))}%`,
                        top: `${Math.min(85, Math.max(5, y))}%`,
                      }}
                    >
                      <div
                        className={`relative ${selectedShuttle?.id === shuttle.id ? 'scale-125' : ''}`}
                      >
                        {/* Ping animation for active shuttles */}
                        {shuttle.status === 'active' && (
                          <div className="absolute inset-0 -m-2 rounded-full bg-sidebar-primary/30 animate-ping" />
                        )}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                            shuttle.status === 'active'
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                              : shuttle.status === 'idle'
                              ? 'bg-warning text-warning-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}
                          style={{
                            transform: `rotate(${shuttle.heading}deg)`,
                          }}
                        >
                          <Bus className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Legend */}
                <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sidebar-primary" />
                    <span className="text-muted-foreground">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Idle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <span className="text-muted-foreground">Maintenance</span>
                  </div>
                </div>
              </div>

              {/* Selected Shuttle Details */}
              {selectedShuttle && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg animate-scale-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedShuttle.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedShuttle.route}</p>
                    </div>
                    <Badge className={getStatusColor(selectedShuttle.status)}>{selectedShuttle.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Speed</p>
                      <p className="font-medium flex items-center gap-1">
                        <Gauge className="h-4 w-4" />
                        {Number(selectedShuttle.speed).toFixed(1)} km/h
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Heading</p>
                      <p className="font-medium flex items-center gap-1">
                        <Compass className="h-4 w-4" />
                        {Math.round(selectedShuttle.heading)}° {getHeadingDirection(selectedShuttle.heading)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Next Stop</p>
                      <p className="font-medium flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {selectedShuttle.next_stop}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">ETA</p>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedShuttle.eta} min
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shuttle</DialogTitle>
            <DialogDescription>Update shuttle information.</DialogDescription>
          </DialogHeader>
          <ShuttleFormFields />
          <Button onClick={handleUpdateShuttle} disabled={updateShuttle.isPending}>
            {updateShuttle.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShuttlePage;
