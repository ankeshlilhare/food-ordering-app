export interface User {
  username: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  countryId: number | null;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  jwt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  cuisine: string;
  address: string;
  phoneNumber: string;
  countryId: number;
  countryName: string;
  isActive: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  restaurantId: number;
  restaurantName: string;
  isAvailable: boolean;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  menuItemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  username: string;
  restaurantId: number;
  restaurantName: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  restaurantId: number;
  items: OrderItemRequest[];
  paymentMethod: string;
}

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

