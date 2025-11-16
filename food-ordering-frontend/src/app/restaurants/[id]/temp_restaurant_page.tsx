'use client';

// Imported useMemo
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { Restaurant, MenuItem, OrderItemRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, isManager, user } = useAuth();
  const restaurantId = parseInt(params.id as string);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Map<number, number>>(new Map());
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1555992336-03a23c4d4d2f?w=1200&q=80&auto=format&fit=crop';
  const [imageSrc, setImageSrc] = useState<string>(FALLBACK_IMAGE);

  const useINRCurrency = useMemo(() => {
    return (restaurant?.countryId === 1) || (user?.countryId === 1);
  }, [restaurant, user]);
  const [currency, setCurrency] = useState<{ locale: string; code: string }>({ locale: 'en-US', code: 'USD' });

  useEffect(() => {
    // Determine currency from restaurant or user info. Prioritize explicit IDs, then name.
    const isIndian = (restaurant?.countryId === 1) || (user?.countryId === 1) || (restaurant?.countryName?.toLowerCase?.().includes('india'));
    if (isIndian) {
      setCurrency({ locale: 'en-IN', code: 'INR' });
    } else {
      setCurrency({ locale: 'en-US', code: 'USD' });
    }
  }, [restaurant, user]);

  const formatPrice = (price: number) => {
    const value = Number(price) || 0;
    return new Intl.NumberFormat(currency.locale, { style: 'currency', currency: currency.code }).format(value);
  };

  // Combined data fetching into one useEffect with Promise.all
  useEffect(() => {
    const loadData = async () => {
      // Don't proceed if restaurantId is not a valid number
      if (isNaN(restaurantId)) {
        setError('Invalid restaurant ID.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(''); // Clear previous errors on new load

        // Fetch restaurant and menu items at the same time
        const [restaurantData, menuItemsData] = await Promise.all([
          apiClient.getRestaurantById(restaurantId),
          apiClient.getMenuItemsByRestaurant(restaurantId),
        ]);

        setRestaurant(restaurantData);
        // set image source to restaurant image if available, otherwise fallback
        setImageSrc(restaurantData?.imageUrl || FALLBACK_IMAGE);
        setMenuItems(menuItemsData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load restaurant details');
        setRestaurant(null); // Ensure no stale data is shown
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantId]);
  
  const addToCart = (menuItemId: number) => {
    // Clear any existing errors when user takes action
    setError('');
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(menuItemId) || 0;
      newCart.set(menuItemId, currentQty + 1);
      return newCart;
    });
  };

  const removeFromCart = (menuItemId: number) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(menuItemId) || 0;
      if (currentQty <= 1) {
        newCart.delete(menuItemId);
      } else {
        newCart.set(menuItemId, currentQty - 1);
      }
      return newCart;
    });
  };
  
  const handleCheckout = async () => {
    if (cart.size === 0) {
      setError('Cart is empty');
      return;
    }

    if (!isAdmin && !isManager) {
      setError('Only ADMIN or MANAGER can create orders');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const items: OrderItemRequest[] = Array.from(cart.entries()).map(([menuItemId, quantity]) => ({
        menuItemId,
        quantity,
      }));

      await apiClient.createOrder({
        restaurantId,
        items,
        paymentMethod,
      });

      router.push('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  // Memoize cartItems calculation for performance
  const cartItems = useMemo(() => {
    return Array.from(cart.entries())
      .map(([menuItemId, quantity]) => {
        const item = menuItems.find((m) => m.id === menuItemId);
        return item ? { ...item, quantity } : null;
      })
      .filter((item) => item !== null) as (MenuItem & { quantity: number })[];
  }, [cart, menuItems]); // Only recalculates if cart or menuItems changes

  // Memoize cartTotal calculation, reusing memoized cartItems
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]); // Only recalculates if cartItems changes


  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading restaurant details...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!restaurant) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">{error || 'Restaurant not found.'}</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <svg className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Restaurant Header */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-md">
            <img
              src={imageSrc}
              alt={`${restaurant.name} - Restaurant`}
              className="w-full h-96 object-cover mb-4"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== FALLBACK_IMAGE) target.src = FALLBACK_IMAGE;
              }}
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-600">{restaurant.address}</p>
              {/* Debug/verification: show resolved currency code */}
              <span className="text-sm text-gray-500">({currency.code})</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Menu Items */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
              
              {menuItems.length === 0 ? (
                <p className="text-gray-600">No menu items available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {menuItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={item.imageUrl || FALLBACK_IMAGE}
                          alt={`${item.name} - dish`}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const t = e.currentTarget as HTMLImageElement;
                            if (t.src !== FALLBACK_IMAGE) t.src = FALLBACK_IMAGE;
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded font-semibold shadow">{formatPrice(item.price)}</div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => addToCart(item.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-gray-50 rounded-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Cart</h2>

                {cartItems.length === 0 ? (
                  <p className="text-gray-600">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-200 pb-4">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{formatPrice(item.price)} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-600 hover:text-red-800 font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="text-green-600 hover:text-green-800 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Cart Total */}
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">{formatPrice(cartTotal)}</span>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="DEBIT_CARD">Debit Card</option>
                        <option value="CASH">Cash</option>
                      </select>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                      {submitting ? 'Processing...' : 'Checkout'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
