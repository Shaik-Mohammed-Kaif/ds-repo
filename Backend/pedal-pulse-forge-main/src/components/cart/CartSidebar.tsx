import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { Link } from 'react-router-dom';

const CartSidebar = () => {
  const { 
    state, 
    removeFromCart, 
    updateQuantity, 
    toggleCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={toggleCart}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 animate-slide-in-right">
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Shopping Cart</h2>
              {getTotalItems() > 0 && (
                <Badge className="bg-primary">{getTotalItems()}</Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCart}
              className="hover:bg-muted"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {state.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground text-sm">
                    Browse our collection and add some amazing e-bikes to your cart.
                  </p>
                </div>
                <Link to="/bikes" onClick={toggleCart}>
                  <Button className="btn-primary">
                    Browse Bikes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.items.map((item) => (
                  <div key={item.bike.id} className="group">
                    <div className="flex space-x-4">
                      
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.bike.image}
                          alt={item.bike.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-sm leading-5 truncate">
                              {item.bike.name}
                            </h4>
                            <p className="text-muted-foreground text-xs mt-1 capitalize">
                              {item.bike.category} • {item.bike.specs.range}
                            </p>
                            <p className="font-semibold text-primary mt-2">
                              {formatPrice(item.bike.price)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.bike.id)}
                            className="text-muted-foreground hover:text-destructive ml-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.bike.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.bike.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t p-6 space-y-4">
                
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link to="/checkout" onClick={toggleCart} className="block">
                    <Button className="w-full btn-primary h-12 text-base">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/bikes" onClick={toggleCart} className="block">
                    <Button variant="outline" className="w-full h-10">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center space-x-2 pt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">
                    Secure 256-bit SSL encryption
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;