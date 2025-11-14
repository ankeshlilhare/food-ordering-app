'use client';

import React from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, isAdmin, isManager } = useAuth();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to Food Ordering App
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Order delicious food from your favorite restaurants
            </p>
            <p className="text-sm text-gray-500">
              Logged in as <span className="font-semibold text-gray-700">{user?.username}</span> ({user?.role})
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <Link
              href="/restaurants"
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">🍽️</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Browse Restaurants
                </h2>
                <p className="text-gray-600 mb-4">
                  Explore our selection of restaurants and cuisines from around the world
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-2 transition-transform">
                  Explore <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            <Link
              href="/orders"
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-8 relative z-10">
                <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">📦</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  My Orders
                </h2>
                <p className="text-gray-600 mb-4">
                  View and manage your order history, track status, and cancel orders
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:translate-x-2 transition-transform">
                  View Orders <span className="ml-2">→</span>
                </div>
              </div>
            </Link>

            {(isAdmin || isManager) && (
              <Link
                href="/restaurants"
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-8 relative z-10">
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-3xl">🛒</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    Place Order
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Create a new order from your favorite restaurant
                  </p>
                  <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-2 transition-transform">
                    Order Now <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/admin/restaurants"
                className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 md:col-span-2 lg:col-span-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="p-8 relative z-10">
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <span className="text-3xl">⚙️</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    Admin Panel
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Manage restaurants and system settings
                  </p>
                  <div className="flex items-center text-orange-600 font-medium group-hover:translate-x-2 transition-transform">
                    Manage <span className="ml-2">→</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
