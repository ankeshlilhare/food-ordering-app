import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { LoginRequest, LoginResponse, Restaurant, MenuItem, Order, CreateOrderRequest, ErrorResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('jwt');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          Cookies.remove('jwt');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  }

  // Restaurant endpoints
  async getRestaurants(): Promise<Restaurant[]> {
    const response = await this.client.get<Restaurant[]>('/api/restaurants');
    return response.data;
  }

  async getRestaurantById(id: number): Promise<Restaurant> {
    const response = await this.client.get<Restaurant>(`/api/restaurants/${id}`);
    return response.data;
  }

  async createRestaurant(restaurant: Omit<Restaurant, 'id' | 'countryName' | 'isActive'>): Promise<Restaurant> {
    const response = await this.client.post<Restaurant>('/api/restaurants', restaurant);
    return response.data;
  }

  async deleteRestaurant(id: number): Promise<void> {
    await this.client.delete(`/api/restaurants/${id}`);
  }

  // Menu item endpoints
  async getMenuItemsByRestaurant(restaurantId: number): Promise<MenuItem[]> {
    const response = await this.client.get<MenuItem[]>(`/api/menu-items/restaurant/${restaurantId}`);
    return response.data;
  }

  async createMenuItem(restaurantId: number, menuItem: Omit<MenuItem, 'id' | 'restaurantName' | 'isAvailable'>): Promise<MenuItem> {
    const response = await this.client.post<MenuItem>(`/api/menu-items/restaurant/${restaurantId}`, menuItem);
    return response.data;
  }

  // Order endpoints
  async createOrder(order: CreateOrderRequest): Promise<Order> {
    const response = await this.client.post<Order>('/api/orders', order);
    return response.data;
  }

  async getMyOrders(): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/api/orders');
    return response.data;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const response = await this.client.post<Order>(`/api/orders/${orderId}/cancel`);
    return response.data;
  }

  async updatePaymentMethod(orderId: number, paymentMethod: string): Promise<Order> {
    const response = await this.client.patch<Order>(
      `/api/orders/${orderId}/payment-method`,
      null,
      { params: { paymentMethod } }
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();

