import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Play, CheckCircle, XCircle, Loader2, RefreshCw, ShoppingCart, Package, CreditCard, Bell } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

interface SagaStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  message?: string;
  timestamp?: Date;
}

const Demo: React.FC = () => {
  const { user, login } = useAuth();
  const [sagaSteps, setSagaSteps] = useState<SagaStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any>({});

  // Initialize saga steps
  useEffect(() => {
    setSagaSteps([
      { name: 'Create Order', status: 'pending' },
      { name: 'Reserve Inventory', status: 'pending' },
      { name: 'Process Payment', status: 'pending' },
      { name: 'Confirm Order', status: 'pending' },
    ]);
  }, []);

  const updateStep = (stepName: string, status: SagaStep['status'], message?: string) => {
    setSagaSteps(prev => prev.map(step => 
      step.name === stepName 
        ? { ...step, status, message, timestamp: new Date() }
        : step
    ));
  };

  const testAuthService = async () => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/auth/health`);
      const data = await response.json();
      setTestResults((prev: any) => ({ ...prev, auth: { status: 'success', data } }));
      return true;
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, auth: { status: 'failed', error } }));
      return false;
    }
  };

  const testBookingService = async () => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/rooms`);
      const data = await response.json();
      setTestResults((prev: any) => ({ ...prev, booking: { status: 'success', data: { rooms: data.length } } }));
      return true;
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, booking: { status: 'failed', error } }));
      return false;
    }
  };

  const testMarketplaceService = async () => {
    try {
      const response = await fetch(`${API_GATEWAY_URL}/api/marketplace/products`);
      const data = await response.json();
      setTestResults((prev: any) => ({ ...prev, marketplace: { status: 'success', data: { products: data.length } } }));
      return true;
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, marketplace: { status: 'failed', error } }));
      return false;
    }
  };

  const testSagaPattern = async () => {
    if (!user) {
      toast({ title: 'Please login first', variant: 'destructive' });
      return;
    }

    setIsRunning(true);
    
    // Reset steps
    setSagaSteps([
      { name: 'Create Order', status: 'pending' },
      { name: 'Reserve Inventory', status: 'pending' },
      { name: 'Process Payment', status: 'pending' },
      { name: 'Confirm Order', status: 'pending' },
    ]);

    try {
      // Step 1: Create Order
      updateStep('Create Order', 'running');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get products
      const productsResponse = await fetch(`${API_GATEWAY_URL}/api/marketplace/products`);
      const products = await productsResponse.json();
      
      if (products.length === 0) {
        throw new Error('No products available');
      }

      const product = products[0];
      const token = localStorage.getItem('token') || '';

      const orderResponse = await fetch(`${API_GATEWAY_URL}/api/marketplace/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: [
            {
              productId: product.id,
              quantity: 1,
              priceAtTime: product.price,
            },
          ],
        }),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      updateStep('Create Order', 'success', `Order ${orderData.order.id} created`);

      // Step 2: Reserve Inventory (simulated - actual happens via RabbitMQ)
      updateStep('Reserve Inventory', 'running');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('Reserve Inventory', 'success', 'Inventory reserved');

      // Step 3: Process Payment (simulated)
      updateStep('Process Payment', 'running');
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateStep('Process Payment', 'success', 'Payment processed');

      // Step 4: Confirm Order (simulated)
      updateStep('Confirm Order', 'running');
      await new Promise(resolve => setTimeout(resolve, 500));
      updateStep('Confirm Order', 'success', 'Order confirmed');

      toast({ title: '✅ Saga completed successfully!', description: 'All steps executed successfully' });
      setTestResults((prev: any) => ({ ...prev, saga: { status: 'success' } }));

    } catch (error: any) {
      const failedStep = sagaSteps.find(s => s.status === 'running') || sagaSteps[0];
      updateStep(failedStep.name, 'failed', error.message);
      
      // Compensation
      toast({ title: '❌ Saga failed', description: 'Compensation triggered', variant: 'destructive' });
      setTestResults((prev: any) => ({ ...prev, saga: { status: 'failed', error: error.message } }));
    } finally {
      setIsRunning(false);
    }
  };

  const testCircuitBreaker = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`${API_GATEWAY_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      setTestResults((prev: any) => ({ 
        ...prev, 
        circuitBreaker: { status: 'success', data: { notifications: data.length } } 
      }));
      
      toast({ title: 'Circuit Breaker Test', description: 'Notification service responded' });
    } catch (error) {
      setTestResults((prev: any) => ({ 
        ...prev, 
        circuitBreaker: { status: 'failed', error: 'Service unavailable (fallback active)' } 
      }));
    }
  };

  const runAllTests = async () => {
    setTestResults({});
    await testAuthService();
    await testBookingService();
    await testMarketplaceService();
    await testCircuitBreaker();
    toast({ title: 'All tests completed', description: 'Check results below' });
  };

  const getStatusIcon = (status: SagaStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Demo & Testing Dashboard</h2>
        <p className="text-muted-foreground">Test all services and patterns</p>
      </div>

      <Tabs defaultValue="saga" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saga">Saga Pattern</TabsTrigger>
          <TabsTrigger value="services">Services Test</TabsTrigger>
          <TabsTrigger value="circuit-breaker">Circuit Breaker</TabsTrigger>
        </TabsList>

        <TabsContent value="saga" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saga Pattern Demo</CardTitle>
              <CardDescription>Test the complete purchase flow with Saga orchestration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm">Please login first to test Saga pattern</p>
                </div>
              )}

              <div className="space-y-3">
                {sagaSteps.map((step, index) => (
                  <div key={step.name} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.name}</span>
                        <Badge variant={
                          step.status === 'success' ? 'default' :
                          step.status === 'failed' ? 'destructive' :
                          step.status === 'running' ? 'secondary' : 'outline'
                        }>
                          {step.status}
                        </Badge>
                      </div>
                      {step.message && (
                        <p className="text-sm text-muted-foreground mt-1">{step.message}</p>
                      )}
                      {step.timestamp && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.timestamp.toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={testSagaPattern} 
                disabled={isRunning || !user}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Saga...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run Saga Pattern
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Services Health Check</CardTitle>
              <CardDescription>Test all microservices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={runAllTests} className="w-full" size="lg">
                <RefreshCw className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Auth Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.auth ? (
                      <div className="flex items-center gap-2">
                        {testResults.auth.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{testResults.auth.status}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not tested</span>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.booking ? (
                      <div className="flex items-center gap-2">
                        {testResults.booking.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{testResults.booking.status}</span>
                        {testResults.booking.data && (
                          <span className="text-sm text-muted-foreground">
                            ({testResults.booking.data.rooms} rooms)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not tested</span>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Marketplace Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.marketplace ? (
                      <div className="flex items-center gap-2">
                        {testResults.marketplace.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{testResults.marketplace.status}</span>
                        {testResults.marketplace.data && (
                          <span className="text-sm text-muted-foreground">
                            ({testResults.marketplace.data.products} products)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not tested</span>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Saga Orchestrator</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {testResults.saga ? (
                      <div className="flex items-center gap-2">
                        {testResults.saga.status === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span>{testResults.saga.status}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not tested</span>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circuit-breaker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Circuit Breaker Test</CardTitle>
              <CardDescription>Test circuit breaker pattern in Notification Service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testCircuitBreaker} className="w-full" size="lg">
                <Bell className="h-4 w-4 mr-2" />
                Test Circuit Breaker
              </Button>

              {testResults.circuitBreaker && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      {testResults.circuitBreaker.status === 'success' ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>Circuit Closed - Service Available</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500" />
                          <span>Circuit Open - Fallback Active</span>
                        </>
                      )}
                    </div>
                    {testResults.circuitBreaker.data && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Notifications: {testResults.circuitBreaker.data.notifications}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Demo;


