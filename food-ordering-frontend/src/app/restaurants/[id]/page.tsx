'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { Restaurant, MenuItem, OrderItemRequest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function RestaurantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAdmin, isManager } = useAuth();
  const restaurantId = parseInt(params.id as string);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<Map<number, number>>(new Map());
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRestaurant();
    loadMenuItems();
  }, [restaurantId]);

  const loadRestaurant = async () => {
    try {
      const data = await apiClient.getRestaurantById(restaurantId);
      setRestaurant(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load restaurant');
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMenuItemsByRestaurant(restaurantId);
      setMenuItems(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (menuItemId: number) => {
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

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((quantity, menuItemId) => {
      const item = menuItems.find((m) => m.id === menuItemId);
      if (item) {
        total += item.price * quantity;
      }
    });
    return total;
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

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
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
          <div className="px-4 py-6">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
              <p className="font-medium">Restaurant not found</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const cartItems = Array.from(cart.entries())
    .map(([menuItemId, quantity]) => {
      const item = menuItems.find((m) => m.id === menuItemId);
      return item ? { ...item, quantity } : null;
    })
    .filter((item) => item !== null) as (MenuItem & { quantity: number })[];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors group"
          >
            <svg className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Restaurants
          </button>

          <div className="relative h-64 rounded-2xl overflow-hidden mb-6">
            <img
              src={restaurant.imageUrl || 'https://via.placeholder.com/800x400'}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold">{restaurant.name}</h1>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                    🍜 {restaurant.cuisine}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-800">
                    📍 {restaurant.countryName}
                  </span>
                  {restaurant.isActive ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      ✓ Open
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      ✗ Closed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {restaurant.address}
                </p>
                {restaurant.phoneNumber && (
                  <p className="text-gray-500 text-sm mt-2 flex items-center">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {restaurant.phoneNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-shake">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
              {menuItems.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                  <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🍽️</span>
                  </div>
                  <p className="text-gray-500 text-lg">No menu items available</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                          <span className="text-lg font-bold text-blue-600 ml-4">
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2">
                          {item.category && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {item.category}
                            </span>
                          )}
                          {!item.isAvailable && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                      {item.isAvailable && (isAdmin || isManager) && (
                        <div className="flex items-center space-x-3 ml-6">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            disabled={!cart.has(item.id)}
                            className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-semibold text-gray-900">
                            {cart.get(item.id) || 0}
                          </span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-md"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">🛒</span>
                  Cart
                </h2>

                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🛒</span>
                    </div>
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 ml-4">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {(isAdmin || isManager) ? (
                      <>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payment Method
                          </label>
                          <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="CREDIT_CARD">💳 Credit Card</option>
                            <option value="DEBIT_CARD">💳 Debit Card</option>
                            <option value="UPI">📱 UPI</option>
                            <option value="CASH">💵 Cash</option>
                          </select>
                        </div>
                        <button
                          onClick={handleCheckout}
                          disabled={submitting || cartItems.length === 0}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                        >
                          {submitting ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Placing Order...
                            </span>
                          ) : (
                            'Place Order'
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 text-center">
                          Only ADMIN or MANAGER can create orders
                        </p>
                      </div>
                    )}
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
