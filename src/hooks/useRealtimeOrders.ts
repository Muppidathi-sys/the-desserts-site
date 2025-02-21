import { useEffect } from 'react';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export function useRealtimeOrders() {
  const { fetchOrders } = useStore();

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupRealtimeSubscription = async () => {
      // Subscribe to orders table changes
      channel = supabase
        .channel('orders-channel')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          () => {
            // Refresh orders when any change occurs
            fetchOrders();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'order_items'
          },
          () => {
            // Refresh orders when order items change
            fetchOrders();
          }
        )
        .subscribe();
    };

    setupRealtimeSubscription();

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [fetchOrders]);
} 