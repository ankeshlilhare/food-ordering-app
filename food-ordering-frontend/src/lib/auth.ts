import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // username
  role: string;
  countryId?: number;
  exp: number;
}

export interface AuthUser {
  username: string;
  role: 'ADMIN' | 'MANAGER' | 'MEMBER';
  countryId: number | null;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return Cookies.get('jwt') || null;
}

export function setToken(token: string): void {
  Cookies.set('jwt', token, { expires: 1 }); // 1 day expiry
}

export function removeToken(): void {
  Cookies.remove('jwt');
}

export function getUserFromToken(): AuthUser | null {
  const token = getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return {
      username: decoded.sub,
      role: decoded.role.replace('ROLE_', '') as 'ADMIN' | 'MANAGER' | 'MEMBER',
      countryId: decoded.countryId || null,
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    removeToken();
    return null;
  }
}

export function isTokenExpired(): boolean {
  const token = getToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}

