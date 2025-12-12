import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRooms, useBookings, useCreateBooking, Room } from '@/hooks/useRooms';
import { useAuth } from '@/contexts/AuthContext';
import { Users, MapPin, Clock, CalendarDays, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Booking: React.FC = () => {
  const { currentTenant } = useAuth();
  const { data: rooms, isLoading: roomsLoading } = useRooms();
  const { data: bookings } = useBookings();
  const createBooking = useCreateBooking();
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    startTime: '09:00',
    endTime: '11:00',
    purpose: '',
  });

  const filteredRooms = rooms?.filter(room => room.tenant === currentTenant) || [];

  const handleBookRoom = async () => {
    if (!selectedRoom || !selectedDate || !bookingForm.purpose) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const startTime = new Date(selectedDate);
    const [startHours, startMinutes] = bookingForm.startTime.split(':');
    startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

    const endTime = new Date(selectedDate);
    const [endHours, endMinutes] = bookingForm.endTime.split(':');
    endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

    try {
      await createBooking.mutateAsync({
        room_id: selectedRoom.id,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        purpose: bookingForm.purpose,
      });

      toast({
        title: 'Room Booked Successfully!',
        description: `${selectedRoom.name} has been reserved for ${format(selectedDate, 'PPP')} from ${bookingForm.startTime} to ${bookingForm.endTime}`,
      });
      
      setBookingDialogOpen(false);
      setBookingForm({ startTime: '09:00', endTime: '11:00', purpose: '' });
    } catch (error) {
      toast({
        title: 'Booking failed',
        description: 'There was an error creating your booking. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getRoomStatus = (room: Room) => {
    const hasBooking = bookings?.some(b => b.room_id === room.id && b.status === 'confirmed');
    if (!room.is_available) return { label: 'Unavailable', variant: 'destructive' as const };
    if (hasBooking) return { label: 'Booked', variant: 'secondary' as const };
    return { label: 'Available', variant: 'default' as const };
  };

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Room Booking</h2>
          <p className="text-muted-foreground">Reserve rooms for classes, meetings, and events</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <Input placeholder="Search rooms..." className="max-w-xs" />
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">All Rooms</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-muted">Available</Badge>
          </div>

          {filteredRooms.length === 0 ? (
            <Card className="glass-card p-8 text-center">
              <p className="text-muted-foreground">No rooms available for your faculty</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRooms.map((room, index) => {
                const status = getRoomStatus(room);
                return (
                  <Card 
                    key={room.id} 
                    className="glass-card hover-lift cursor-pointer animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {room.building}, Floor {room.floor}
                          </CardDescription>
                        </div>
                        <Badge className={status.variant === 'default' ? 'badge-success' : status.variant === 'destructive' ? 'badge-destructive' : 'badge-warning'}>
                          {status.label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {room.capacity} seats
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.slice(0, 4).map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Calendar & Booking Panel */}
        <div className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sidebar-primary" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {selectedRoom && (
            <Card className="glass-card animate-scale-in">
              <CardHeader>
                <CardTitle className="text-lg">Selected Room</CardTitle>
                <CardDescription>{selectedRoom.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Building</span>
                    <span className="font-medium">{selectedRoom.building}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{selectedRoom.capacity} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">{selectedDate ? format(selectedDate, 'PPP') : 'Not selected'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedRoom.amenities?.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>

                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" variant="accent" disabled={!selectedRoom.is_available}>
                      <Clock className="h-4 w-4 mr-2" />
                      Book This Room
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Book {selectedRoom.name}</DialogTitle>
                      <DialogDescription>
                        Fill in the details to complete your booking for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Time</Label>
                          <Input
                            type="time"
                            value={bookingForm.startTime}
                            onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Time</Label>
                          <Input
                            type="time"
                            value={bookingForm.endTime}
                            onChange={(e) => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Purpose</Label>
                        <Textarea
                          placeholder="Describe the purpose of your booking..."
                          value={bookingForm.purpose}
                          onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleBookRoom}
                        disabled={createBooking.isPending}
                      >
                        {createBooking.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Booking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirm Booking
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
