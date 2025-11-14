'use client';

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function OrdersPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await apiClient.cancelOrder(orderId);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleUpdatePayment = async (orderId: number) => {
    const paymentMethod = prompt('Enter payment method (CREDIT_CARD, DEBIT_CARD, UPI, CASH):');
    if (!paymentMethod) return;

    try {
      await apiClient.updatePaymentMethod(orderId, paymentMethod);
      loadOrders();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update payment method');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
            <p className="text-gray-600">View and manage your order history</p>
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

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl">📦</span>
              </div>
              <p className="text-gray-500 text-lg font-medium">No orders found</p>
              <p className="text-gray-400 text-sm mt-2">Start ordering from restaurants to see your orders here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            Order #{order.id}
                          </h2>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                : order.status === 'CONFIRMED'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {order.status === 'PENDING' && '⏳'}
                            {order.status === 'CONFIRMED' && '✓'}
                            {order.status === 'CANCELLED' && '✗'}
                            {' '}
                            {order.status}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-1 flex items-center">
                          <span className="mr-2">🍽️</span>
                          {order.restaurantName}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 md:text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          ${order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <span className="mr-2">📋</span>
                        Order Items
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.menuItemName}</p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Payment Method:</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                          {order.paymentMethod}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-md"
                          >
                            Cancel Order
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleUpdatePayment(order.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 active:scale-95 shadow-md"
                          >
                            Update Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
