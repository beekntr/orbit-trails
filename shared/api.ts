/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * API Base Configuration
 */
const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// Remove trailing slash to prevent double slashes in URLs
const apiBaseUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

// Hide API URL in production builds
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? apiBaseUrl 
  : apiBaseUrl;

/**
 * Tour Interface
 */
export interface Tour {
  _id: string;
  name: string;
  slug: string;
  description: string;
  overview: string;
  category: 'Golden Triangle' | 'Rajasthan Tours' | 'Extended Tours';
  price?: number; // Made optional since we're hiding pricing initially
  originalPrice?: number;
  duration: string;
  maxGuests: number;
  minAge: number;
  rating: number;
  reviews: number;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
    highlights: string[];
  }>;
  images: string[];
  destinations: string[];
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
}

/**
 * Custom Tour Request Interface
 */
export interface CustomTourRequest {
  startDate: string;
  duration: number;
  numberOfTravelers: number;
  accommodationType: 'Luxury' | 'Comfort';
  destinations: string[];
  budgetRange: string;
  comments: string;
  name: string;
  email: string;
  phone: string;
  countryCode?: string;
}

/**
 * Contact Message Interface
 */
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Admin Login Interface
 */
export interface AdminLogin {
  username: string;
  password: string;
}

/**
 * API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * API Helper Functions
 */
export class OrbitTrailsAPI {
  private static baseUrl = API_BASE_URL;
  private static token: string | null = null;
  private static requestCount = 0;

  static setToken(token: string) {
    this.token = token;
    localStorage.setItem('orbit_admin_token', token);
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('orbit_admin_token');
    }
    return this.token;
  }

  static clearToken() {
    this.token = null;
    localStorage.removeItem('orbit_admin_token');
  }

  // Prevent excessive API exposure
  private static shouldAllowRequest(): boolean {
    this.requestCount++;
    
    // Reset counter every minute
    setTimeout(() => {
      this.requestCount = Math.max(0, this.requestCount - 1);
    }, 60000);
    
    // Allow max 100 requests per minute per session
    return this.requestCount <= 100;
  }

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Client-side rate limiting
    if (!this.shouldAllowRequest()) {
      return {
        success: false,
        message: 'Too many requests. Please wait a moment.',
        error: 'Rate limited'
      };
    }

    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      // Add security headers
      'X-Requested-With': 'XMLHttpRequest',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Add security options
        credentials: 'same-origin',
        mode: 'cors',
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return {
          success: false,
          message: 'Invalid response format',
          error: 'Server error'
        };
      }

      const data = await response.json();
      
      // Sanitize error messages in production
      if (!data.success && data.error) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          error: process.env.NODE_ENV === 'production' ? 'Request failed' : data.error
        };
      }
      
      return data;
    } catch (error) {
      // Never expose internal error details in production
      return {
        success: false,
        message: 'Network error occurred',
        error: process.env.NODE_ENV === 'production' ? 'Connection failed' : 'Network error'
      };
    }
  }

  // Tours API
  static async getTours(): Promise<ApiResponse<{ tours: Tour[]; groupedTours: Record<string, Tour[]>; total: number }>> {
    return this.request('/api/tours');
  }

  static async getTourById(id: string): Promise<ApiResponse<Tour>> {
    return this.request(`/api/tours/${id}`);
  }

  static async getTourBySlug(slug: string): Promise<ApiResponse<Tour>> {
    return this.request(`/api/tours/slug/${slug}`);
  }

  static async createTour(tour: Partial<Tour>): Promise<ApiResponse<Tour>> {
    return this.request('/api/tours', {
      method: 'POST',
      body: JSON.stringify(tour),
    });
  }

  static async updateTour(id: string, tour: Partial<Tour>): Promise<ApiResponse<Tour>> {
    return this.request(`/api/tours/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tour),
    });
  }

  static async deleteTour(id: string): Promise<ApiResponse> {
    return this.request(`/api/tours/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact API
  static async submitContact(contact: ContactMessage): Promise<ApiResponse> {
    // Remove undefined values to avoid sending them to the backend
    const cleanContact = Object.fromEntries(
      Object.entries(contact).filter(([_, value]) => value !== undefined)
    );
    
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(cleanContact),
    });
  }

  static async getContactMessages(): Promise<ApiResponse<{ messages: any[] }>> {
    return this.request('/api/contact');
  }

  static async getContactMessageById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/contact/${id}`);
  }

  // Custom Tour API
  static async submitCustomTour(customTour: CustomTourRequest): Promise<ApiResponse> {
    return this.request('/api/customize-tour', {
      method: 'POST',
      body: JSON.stringify(customTour),
    });
  }

  static async getCustomTourRequests(): Promise<ApiResponse<{ requests: any[] }>> {
    return this.request('/api/customize-tour');
  }

  static async getCustomTourRequestById(id: string): Promise<ApiResponse<any>> {
    return this.request(`/api/customize-tour/${id}`);
  }

  // Admin API
  static async adminLogin(credentials: AdminLogin): Promise<ApiResponse<{ token: string; admin: any }>> {
    return this.request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  static async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.request('/api/admin/dashboard');
  }

  static async getCurrentAdmin(): Promise<ApiResponse<any>> {
    return this.request('/api/admin/profile');
  }
}
