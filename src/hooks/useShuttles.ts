import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Shuttle {
  id: string;
  shuttle_id: string;
  name: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: 'active' | 'idle' | 'maintenance';
  route: string;
  next_stop: string;
  eta: number;
  last_updated: string;
}

export const useShuttles = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['shuttles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shuttles')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Shuttle[];
    },
    enabled: isAuthenticated,
    refetchInterval: 5000,
  });
};

export const useCreateShuttle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shuttle: Omit<Shuttle, 'id' | 'last_updated'>) => {
      const { data, error } = await supabase
        .from('shuttles')
        .insert(shuttle)
        .select()
        .single();

      if (error) throw error;
      return data as Shuttle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
    },
  });
};

export const useUpdateShuttle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Shuttle> & { id: string }) => {
      const { data, error } = await supabase
        .from('shuttles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Shuttle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
    },
  });
};

export const useDeleteShuttle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shuttles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shuttles'] });
    },
  });
};
