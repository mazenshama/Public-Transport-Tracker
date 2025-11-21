import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';

export interface Bus {
  id: string;
  number: string;
  capacity: number;
  routeName?: string;
  status: string; // 'active' | 'inactive' | 'available' | 'out-of-service'
}

export interface RouteModel {
  id: string;
  busNumber: string;
  routeName: string;
  stops: string[];
  startTime: string;
  endTime: string;
  frequency: string;
}

export interface Tracking {
  busId: string;
  latitude?: number;
  longitude?: number;
  heading?: number;
  timestamp: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  submittedAt: string;
}

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   // private apiUrl = environment.apiBaseUrl || 'https://localhost:7114';
// // private apiUrl = `${environment.apiBaseUrl}/Admin`;
// private apiUrl = environment.apiBaseUrl;

//   constructor(private http: HttpClient) {}

//   // Buses
//   async getBuses(): Promise<{ buses: Bus[] }> {
//     try {
//       const response = await this.http.get<{ buses: Bus[] }>(`${this.apiUrl}/buses`).toPromise();
//       return response || { buses: [] };
//     } catch (error) {
//       console.error('Error fetching buses:', error);
//       return { buses: [] };
//     }
//   }

//   async createBus(payload: { number: any; capacity: any; routeName?: any }): Promise<any> {
//     try {
//       const response = await this.http.post<{ success: boolean; bus: Bus }>(
//         `${this.apiUrl}/buses`,
//         {
//           number: String(payload.number),
//           capacity: Number(payload.capacity) || 0,
//           routeName: payload.routeName ? String(payload.routeName) : null
//         }
//       ).toPromise();

//       if (response?.success) {
//         return response;
//       }
//       throw new Error('Failed to create bus');
//     } catch (error: any) {
//       console.error('Error creating bus:', error);
//       throw error;
//     }
//   }

//   async deleteBus(busId: string): Promise<any> {
//     try {
//       const response = await this.http.delete<{ success: boolean }>(
//         `${this.apiUrl}/buses/${busId}`
//       ).toPromise();

//       return response || { success: false };
//     } catch (error) {
//       console.error('Error deleting bus:', error);
//       throw error;
//     }
//   }

//   // Routes
//   async getRoutes(): Promise<{ routes: RouteModel[] }> {
//     try {
//       const response = await this.http.get<{ routes: RouteModel[] }>(`${this.apiUrl}/routes`).toPromise();
//       return response || { routes: [] };
//     } catch (error) {
//       console.error('Error fetching routes:', error);
//       return { routes: [] };
//     }
//   }

//   async createRoute(payload: Partial<RouteModel>): Promise<any> {
//     try {
//       const response = await this.http.post<{ success: boolean; route: RouteModel }>(
//         `${this.apiUrl}/routes`,
//         {
//           busNumber: String(payload.busNumber || ''),
//           routeName: String(payload.routeName || ''),
//           stops: payload.stops || [],
//           startTime: String(payload.startTime || ''),
//           endTime: String(payload.endTime || ''),
//           frequency: String(payload.frequency || '')
//         }
//       ).toPromise();

//       if (response?.success) {
//         return response;
//       }
//       throw new Error('Failed to create route');
//     } catch (error: any) {
//       console.error('Error creating route:', error);
//       throw error;
//     }
//   }

//   async deleteRoute(routeId: string): Promise<any> {
//     try {
//       const response = await this.http.delete<{ success: boolean }>(
//         `${this.apiUrl}routes/${routeId}`
//       ).toPromise();

//       return response || { success: false };
//     } catch (error) {
//       console.error('Error deleting route:', error);
//       throw error;
//     }
//   }

//   // Contacts
//   async getContacts(): Promise<{ contacts: Contact[] }> {
//     try {
//       const response = await this.http.get<{ contacts: Contact[] }>(`${this.apiUrl}/contacts`).toPromise();
//       return response || { contacts: [] };
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//       return { contacts: [] };
//     }
//   }

//   // Tracking
//   async getAllTracking(): Promise<{ tracking: Tracking[] }> {
//     try {
//       const response = await this.http.get<{ tracking: Tracking[] }>(`${this.apiUrl}tracking`).toPromise();
//       return response || { tracking: [] };
//     } catch (error) {
//       console.error('Error fetching tracking:', error);
//       return { tracking: [] };
//     }
//   }
// }
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // Buses
  async getBuses(): Promise<{ buses: Bus[] }> {
    try {
      const response = await this.http
        .get<{ buses: Bus[] }>(`${this.apiUrl}/admin/buses`)
        .toPromise();
      return response || { buses: [] };
    } catch (error) {
      console.error('Error fetching buses:', error);
      return { buses: [] };
    }
  }

  async createBus(payload: any): Promise<any> {
    try {
      const response = await this.http
        .post(`${this.apiUrl}/admin/buses`, {
          number: String(payload.number),
          capacity: Number(payload.capacity) || 0,
          routeName: payload.routeName || null
        })
        .toPromise();

      return response;
    } catch (error: any) {
      console.error('Error creating bus:', error);
      throw error;
    }
  }

  async deleteBus(busId: string): Promise<any> {
    try {
      const response = await this.http
        .delete(`${this.apiUrl}/admin/buses/${busId}`)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting bus:', error);
      throw error;
    }
  }

  // Routes
  async getRoutes(): Promise<{ routes: RouteModel[] }> {
    try {
      const response = await this.http
        .get<{ routes: RouteModel[] }>(`${this.apiUrl}/admin/routes`)
        .toPromise();
      return response || { routes: [] };
    } catch (error) {
      console.error('Error fetching routes:', error);
      return { routes: [] };
    }
  }

  async createRoute(payload: Partial<RouteModel>): Promise<any> {
    try {
      const response = await this.http
        .post(`${this.apiUrl}/admin/routes`, payload)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error creating route:', error);
      throw error;
    }
  }

  async deleteRoute(routeId: string): Promise<any> {
    try {
      const response = await this.http
        .delete(`${this.apiUrl}/admin/routes/${routeId}`)
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error deleting route:', error);
      throw error;
    }
  }

  // Contacts
  async getContacts(): Promise<{ contacts: Contact[] }> {
    try {
      const response = await this.http
        .get<{ contacts: Contact[] }>(`${this.apiUrl}/admin/contacts`)
        .toPromise();
      return response || { contacts: [] };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return { contacts: [] };
    }
  }

  // Tracking
  async getAllTracking(): Promise<{ tracking: Tracking[] }> {
    try {
      const response = await this.http
        .get<{ tracking: Tracking[] }>(`${this.apiUrl}/admin/tracking`)
        .toPromise();
      return response || { tracking: [] };
    } catch (error) {
      console.error('Error fetching tracking:', error);
      return { tracking: [] };
    }
  }
}
