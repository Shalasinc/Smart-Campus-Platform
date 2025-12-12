import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  seller_id: string;
  category: string;
  stock: number;
  image: string | null;
  tenant: 'engineering' | 'medical';
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
}

export const useProducts = () => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Product[];
    },
    enabled: isAuthenticated,
  });
};

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CartItem[];
    },
    enabled: isAuthenticated && !!user,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!user) throw new Error('Not authenticated');

      // Check if item already in cart
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data as CartItem;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', cartItemId);

        if (error) throw error;
        return null;
      }

      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId)
        .select()
        .single();

      if (error) throw error;
      return data as CartItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (items: { productId: string; quantity: number; priceAtTime: number }[]) => {
      if (!user) throw new Error('Not authenticated');

      const totalAmount = items.reduce((sum, item) => sum + item.priceAtTime * item.quantity, 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price_at_time: item.priceAtTime,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update order status through the saga workflow simulation
      await supabase
        .from('orders')
        .update({ status: 'processing' })
        .eq('id', order.id);

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      return order as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useOrders = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
    enabled: isAuthenticated && !!user,
  });
};
