'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Restaurant, MenuItem } from '@/types';

export default function AddMenuItemPage() {
  const router = useRouter();
  const { isAdmin, isManager } = useAuth();

  // Check if user has access - only ADMIN and MANAGER can add menu items
  const hasAccess = isAdmin || isManager;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    restaurantId: '',
    name: '',
    description: '',
    price: '',
    category: 'MAIN_COURSE',
    imageUrl: '',
  });

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getRestaurants();
        setRestaurants(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load restaurants');
      } finally {
        setLoading(false);
      }
    };

    if (hasAccess) {
      loadRestaurants();
    }
  }, [hasAccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!formData.restaurantId || !formData.name || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const menuItem = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
      };

      await apiClient.createMenuItem(parseInt(formData.restaurantId), menuItem as any);

      setSuccess('Menu item added successfully!');
      setFormData({
        restaurantId: '',
        name: '',
        description: '',
        price: '',
        category: 'MAIN_COURSE',
        imageUrl: '',
      });

      // Redirect to restaurant detail after 2 seconds
      setTimeout(() => {
        router.push(`/restaurants/${formData.restaurantId}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add menu item');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasAccess) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800">You don't have permission to access this page. Only ADMIN and MANAGER roles can add menu items.</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading restaurants...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8">
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

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Menu Item</h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8">
            {/* Restaurant Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Restaurant <span className="text-red-600">*</span>
              </label>
              <select
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Choose a restaurant --</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Item Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Item Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Butter Chicken"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Creamy tomato-based curry with tender chicken"
                rows={4}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Price */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., 450.00"
                step="0.01"
                min="0"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="APPETIZER">Appetizer</option>
                <option value="MAIN_COURSE">Main Course</option>
                <option value="DESSERT">Dessert</option>
                <option value="BEVERAGE">Beverage</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="e.g., https://images.unsplash.com/..."
                className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">Optional: Provide a URL to a food image</p>
            </div>

            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mb-8">
                <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {submitting ? 'Adding Item...' : 'Add Menu Item'}
            </button>
          </form>

          {/* Available Restaurants Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Available Restaurants:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {restaurants.map((restaurant) => (
                <li key={restaurant.id}>• {restaurant.name} ({restaurant.cuisine})</li>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
