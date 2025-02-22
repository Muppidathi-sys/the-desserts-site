import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const payload = await req.json()
    const { type, record, old_record } = payload

    // Handle different webhook events
    switch (type) {
      case 'INSERT':
        await handleOrderCreated(record)
        break
      case 'UPDATE':
        await handleOrderUpdated(record, old_record)
        break
      case 'DELETE':
        await handleOrderDeleted(old_record)
        break
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function handleOrderCreated(order) {
  // Handle new order creation
  console.log('New order created:', order)
  
  // Example: Send notification to kitchen
  if (order.status === 'new') {
    await sendKitchenNotification(order)
  }
}

async function handleOrderUpdated(newOrder, oldOrder) {
  // Handle order status changes
  console.log('Order updated:', { old: oldOrder, new: newOrder })
  
  if (newOrder.status !== oldOrder.status) {
    switch (newOrder.status) {
      case 'processing':
        await sendKitchenNotification(newOrder)
        break
      case 'completed':
        await sendOrderCompletedNotification(newOrder)
        break
      case 'cancelled':
        await sendOrderCancelledNotification(newOrder)
        break
    }
  }
}

async function handleOrderDeleted(order) {
  // Handle order deletion
  console.log('Order deleted:', order)
}

async function sendKitchenNotification(order) {
  // Implement kitchen notification logic
  console.log('Sending kitchen notification for order:', order.order_number)
}

async function sendOrderCompletedNotification(order) {
  // Implement order completion notification
  console.log('Order completed notification:', order.order_number)
}

async function sendOrderCancelledNotification(order) {
  // Implement order cancellation notification
  console.log('Order cancelled notification:', order.order_number)
} 