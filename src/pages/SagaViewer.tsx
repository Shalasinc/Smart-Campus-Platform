import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, ShoppingCart, Package, CreditCard, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

interface Order {
  id: string;
  user_id: string;
  total_amount: string;
  status: 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'failed';
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  inventory_status?: string;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_time: string;
  product?: {
    name: string;
    description: string;
  };
}

const SagaViewer: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Since we don't have a direct orders endpoint, we'll need to create one
      // For now, we'll use a workaround
      const response = await fetch(`${API_GATEWAY_URL}/api/marketplace/products`);
      if (response.ok) {
        // This is a placeholder - we need an orders endpoint
        // For demo, we'll show static data structure
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      processing: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-500' },
      pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-500' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getSagaSteps = (order: Order) => {
    const steps = [
      {
        name: 'Create Order',
        status: order.status === 'pending' || order.status === 'processing' || order.status === 'confirmed' || order.status === 'failed' ? 'success' : 'pending',
        icon: ShoppingCart,
      },
      {
        name: 'Reserve Inventory',
        status: order.status === 'processing' || order.status === 'confirmed' ? 'success' : 
                order.status === 'failed' ? 'failed' : 'pending',
        icon: Package,
      },
      {
        name: 'Process Payment',
        status: order.status === 'confirmed' ? 'success' : 
                order.status === 'failed' ? 'failed' : 'pending',
        icon: CreditCard,
      },
      {
        name: 'Confirm Order',
        status: order.status === 'confirmed' ? 'success' : 'pending',
        icon: CheckCircle,
      },
    ];

    return steps;
  };

  // Mock data for demonstration
  const mockOrders: Order[] = [
    {
      id: 'order-1',
      user_id: 'user-1',
      total_amount: '29.99',
      status: 'confirmed',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item-1',
          product_id: 'product-1',
          quantity: 1,
          price_at_time: '29.99',
          product: { name: 'Laptop Stand', description: 'Adjustable laptop stand' },
        },
      ],
      inventory_status: 'confirmed',
    },
    {
      id: 'order-2',
      user_id: 'user-1',
      total_amount: '49.99',
      status: 'processing',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item-2',
          product_id: 'product-2',
          quantity: 1,
          price_at_time: '49.99',
          product: { name: 'Textbook: Data Structures', description: 'Introduction to Data Structures' },
        },
      ],
      inventory_status: 'reserved',
    },
    {
      id: 'order-3',
      user_id: 'user-2',
      total_amount: '39.98',
      status: 'pending',
      created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item-3',
          product_id: 'product-3',
          quantity: 2,
          price_at_time: '19.99',
          product: { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse' },
        },
      ],
      inventory_status: 'pending',
    },
    {
      id: 'order-4',
      user_id: 'user-2',
      total_amount: '89.99',
      status: 'failed',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        {
          id: 'item-4',
          product_id: 'product-4',
          quantity: 1,
          price_at_time: '89.99',
          product: { name: 'Calculator TI-84', description: 'Graphing calculator' },
        },
      ],
      inventory_status: 'released',
    },
  ];

  const displayOrders = orders.length > 0 ? orders : mockOrders;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Saga Pattern Viewer</h2>
          <p className="text-muted-foreground">مشاهده وضعیت Saga Pattern برای سفارش‌ها</p>
        </div>
        <Button onClick={fetchOrders} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {displayOrders.map((order) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedOrder(order)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <CardDescription>
                  Total: ${order.total_amount} • {new Date(order.created_at).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Saga Steps */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Saga Steps:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {getSagaSteps(order).map((step, index) => {
                        const Icon = step.icon;
                        return (
                          <div key={index} className="flex flex-col items-center p-2 border rounded-lg">
                            <Icon className={`h-5 w-5 mb-1 ${
                              step.status === 'success' ? 'text-green-500' :
                              step.status === 'failed' ? 'text-red-500' :
                              'text-gray-400'
                            }`} />
                            <span className="text-xs text-center">{step.name}</span>
                            {step.status === 'success' && <CheckCircle className="h-3 w-3 text-green-500 mt-1" />}
                            {step.status === 'failed' && <XCircle className="h-3 w-3 text-red-500 mt-1" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  {order.items && order.items.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Items:</h4>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.product?.name || `Product ${item.product_id.slice(0, 8)}`}</span>
                            <span className="text-muted-foreground">
                              {item.quantity}x ${item.price_at_time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inventory Status */}
                  {order.inventory_status && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Inventory:</span>
                      <Badge variant={order.inventory_status === 'confirmed' ? 'default' : 'outline'}>
                        {order.inventory_status}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {displayOrders.filter(o => o.status === 'pending').map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                {getStatusBadge(order.status)}
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="processing">
          {displayOrders.filter(o => o.status === 'processing').map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                {getStatusBadge(order.status)}
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="confirmed">
          {displayOrders.filter(o => o.status === 'confirmed').map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                {getStatusBadge(order.status)}
              </CardHeader>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="failed">
          {displayOrders.filter(o => o.status === 'failed').map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(0, 8)}</CardTitle>
                {getStatusBadge(order.status)}
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            راهنمای استفاده
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• <strong>Pending:</strong> سفارش ایجاد شده، در انتظار شروع Saga</p>
          <p>• <strong>Processing:</strong> Saga در حال اجرا (Inventory reserved, Payment processing)</p>
          <p>• <strong>Confirmed:</strong> Saga با موفقیت تکمیل شد</p>
          <p>• <strong>Failed:</strong> Saga با خطا مواجه شد و Compensation اجرا شد</p>
          <p className="mt-4 text-muted-foreground">
            برای مشاهده جزئیات بیشتر، از pgAdmin استفاده کنید: <a href="http://localhost:5050" target="_blank" className="text-blue-600 underline">http://localhost:5050</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SagaViewer;

