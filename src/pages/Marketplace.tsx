import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProducts, useCart, useAddToCart, useUpdateCartItem, useRemoveFromCart, useCreateOrder, Product, CartItem } from '@/hooks/useMarketplace';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Search, Plus, Minus, Package, CreditCard, Trash2, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Marketplace: React.FC = () => {
  const { currentTenant } = useAuth();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: cartItems, isLoading: cartLoading } = useCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const createOrder = useCreateOrder();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  const filteredProducts = products?.filter(product => {
    const matchesTenant = product.tenant === currentTenant;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || product.category === category;
    return matchesTenant && matchesSearch && matchesCategory;
  }) || [];

  const categories = ['all', ...new Set(products?.filter(p => p.tenant === currentTenant).map(p => p.category) || [])];

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart.mutateAsync({ productId: product.id, quantity: 1 });
      toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' });
    }
  };

  const handleUpdateQuantity = async (cartItem: CartItem, delta: number) => {
    const product = products?.find(p => p.id === cartItem.product_id);
    const newQuantity = cartItem.quantity + delta;
    
    if (newQuantity > (product?.stock || 0)) return;
    
    try {
      await updateCartItem.mutateAsync({ cartItemId: cartItem.id, quantity: newQuantity });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update cart', variant: 'destructive' });
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    try {
      await removeFromCart.mutateAsync(cartItemId);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove item', variant: 'destructive' });
    }
  };

  const getCartTotal = () => {
    return cartItems?.reduce((total, item) => {
      const product = products?.find(p => p.id === item.product_id);
      return total + (product?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  const handleCheckout = async () => {
    if (!cartItems || cartItems.length === 0) return;

    try {
      // Simulate Saga workflow: Order → Inventory → Payment → Notification
      toast({ title: '📦 Order created', description: 'Processing your order...' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({ title: '📋 Inventory checked', description: 'Stock verified and reserved.' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({ title: '💳 Payment processed', description: 'Payment successful!' });
      await new Promise(resolve => setTimeout(resolve, 500));

      const items = cartItems.map(item => {
        const product = products?.find(p => p.id === item.product_id);
        return {
          productId: item.product_id,
          quantity: item.quantity,
          priceAtTime: product?.price || 0,
        };
      });

      await createOrder.mutateAsync(items);
      
      toast({ 
        title: '✅ Order Complete!', 
        description: 'Your order has been placed successfully.',
      });
      
      setCheckoutDialogOpen(false);
    } catch (error) {
      toast({ 
        title: 'Checkout failed', 
        description: 'There was an error processing your order.', 
        variant: 'destructive' 
      });
    }
  };

  if (productsLoading) {
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
          <h2 className="text-2xl font-bold text-foreground">Marketplace</h2>
          <p className="text-muted-foreground">Browse and purchase supplies, textbooks, and equipment</p>
        </div>
        
        <Dialog open={checkoutDialogOpen} onOpenChange={setCheckoutDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="accent" className="relative">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {(cartItems?.length || 0) > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-destructive">
                  {cartItems?.length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Shopping Cart</DialogTitle>
              <DialogDescription>Review your items before checkout</DialogDescription>
            </DialogHeader>
            
            {cartLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : !cartItems || cartItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => {
                  const product = products?.find(p => p.id === item.product_id);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                      <img
                        src={product.image || 'https://via.placeholder.com/64'}
                        alt={product.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleUpdateQuantity(item, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-xl font-bold">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={createOrder.isPending}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Checkout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product, index) => (
          <Card
            key={product.id}
            className="glass-card hover-lift overflow-hidden animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="aspect-square overflow-hidden bg-muted">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                <Badge variant="secondary" className="text-xs shrink-0">{product.category}</Badge>
              </div>
              <CardDescription className="line-clamp-2 text-xs">{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-foreground">${Number(product.price).toFixed(2)}</span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {product.stock} in stock
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={product.stock > 0 ? 'default' : 'secondary'}
                disabled={product.stock === 0 || addToCart.isPending}
                onClick={() => handleAddToCart(product)}
              >
                {product.stock > 0 ? (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
