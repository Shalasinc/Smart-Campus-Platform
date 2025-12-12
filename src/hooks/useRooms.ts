import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: number;
  amenities: string[];
  tenant: 'engineering' | 'medical';
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useRooms = () => {
  const { currentTenant, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['rooms', currentTenant],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Room[];
    },
    enabled: isAuthenticated,
  });
};

export const useBookings = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: isAuthenticated && !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: {
      room_id: string;
      start_time: string;
      end_time: string;
      purpose: string;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          ...booking,
          user_id: user.id,
          status: 'confirmed',
        })
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data as Booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// Admin-only room management hooks
export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();

      if (error) throw error;
      return data as Room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: string }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
};
