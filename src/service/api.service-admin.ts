// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, catchError, throwError, of } from 'rxjs';
// import { environment } from '../environments/environment';

// export interface Bus {
//   id: string;
//   number: string;
//   capacity: number;
//   routeName?: string;
//   status: string; // 'active' | 'inactive' | 'available' | 'out-of-service'
// }

// export interface RouteModel {
//   id: string;
//   busNumber: string;
//   routeName: string;
//   stops: string[];
//   startTime: string;
//   endTime: string;
//   frequency: string;
// }

// export interface Tracking {
//   busId: string;
//   latitude?: number;
//   longitude?: number;
//   heading?: number;
//   timestamp: string;
// }

// export interface Contact {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   subject?: string;
//   message: string;
//   submittedAt: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   private apiUrl = environment.apiBaseUrl;

//   constructor(private http: HttpClient) {}

//   // Buses
//   async getBuses(): Promise<{ buses: Bus[] }> {
//     try {
//       const response = await this.http
//         .get<{ buses: Bus[] }>(`${this.apiUrl}/admin/buses`)
//         .toPromise();
//       return response || { buses: [] };
//     } catch (error) {
//       console.error('Error fetching buses:', error);
//       return { buses: [] };
//     }
//   }

//   async createBus(payload: any): Promise<any> {
//     try {
//       const response = await this.http
//         .post(`${this.apiUrl}/admin/buses`, {
//           number: String(payload.number),
//           capacity: Number(payload.capacity) || 0,
//           routeName: payload.routeName || null
//         })
//         .toPromise();

//       return response;
//     } catch (error: any) {
//       console.error('Error creating bus:', error);
//       throw error;
//     }
//   }

//   async deleteBus(busId: string): Promise<any> {
//     try {
//       const response = await this.http
//         .delete(`${this.apiUrl}/admin/buses/${busId}`)
//         .toPromise();
//       return response;
//     } catch (error) {
//       console.error('Error deleting bus:', error);
//       throw error;
//     }
//   }

//   // Routes
//   async getRoutes(): Promise<{ routes: RouteModel[] }> {
//     try {
//       const response = await this.http
//         .get<{ routes: RouteModel[] }>(`${this.apiUrl}/admin/routes`)
//         .toPromise();
//       return response || { routes: [] };
//     } catch (error) {
//       console.error('Error fetching routes:', error);
//       return { routes: [] };
//     }
//   }

//   async createRoute(payload: Partial<RouteModel>): Promise<any> {
//     try {
//       const response = await this.http
//         .post(`${this.apiUrl}/admin/routes`, payload)
//         .toPromise();
//       return response;
//     } catch (error) {
//       console.error('Error creating route:', error);
//       throw error;
//     }
//   }

//   async deleteRoute(routeId: string): Promise<any> {
//     try {
//       const response = await this.http
//         .delete(`${this.apiUrl}/admin/routes/${routeId}`)
//         .toPromise();
//       return response;
//     } catch (error) {
//       console.error('Error deleting route:', error);
//       throw error;
//     }
//   }

//   // Contacts
//   async getContacts(): Promise<{ contacts: Contact[] }> {
//     try {
//       const response = await this.http
//         .get<{ contacts: Contact[] }>(`${this.apiUrl}/admin/contacts`)
//         .toPromise();
//       return response || { contacts: [] };
//     } catch (error) {
//       console.error('Error fetching contacts:', error);
//       return { contacts: [] };
//     }
//   }

//   // Tracking
//   async getAllTracking(): Promise<{ tracking: Tracking[] }> {
//     try {
//       const response = await this.http
//         .get<{ tracking: Tracking[] }>(`${this.apiUrl}/admin/tracking`)
//         .toPromise();
//       return response || { tracking: [] };
//     } catch (error) {
//       console.error('Error fetching tracking:', error);
//       return { tracking: [] };
//     }
//   }
// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { MOCK_BUSES } from '../app/mock-data/buses.mock';
import { MOCK_ROUTES } from '../app/mock-data/mock-routes';


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

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}


  async getBuses(): Promise<{ buses: Bus[] }> {
    console.warn('Using MOCK DATA for buses ');
    return { buses: MOCK_BUSES };
  }

  async createBus(payload: any): Promise<any> {
    const newBus: Bus = {
      id: (MOCK_BUSES.length + 1).toString(),
      number: String(payload.number),
      capacity: Number(payload.capacity) || 0,
      routeName: payload.routeName || '',
      status: 'available'
    };

    MOCK_BUSES.push(newBus);
    console.warn('Bus added to MOCK ', newBus);

    return { message: 'Bus added to mock data', bus: newBus };
  }

  async deleteBus(busId: string): Promise<any> {
    const index = MOCK_BUSES.findIndex(b => b.id === busId);

    if (index !== -1) {
      const removed = MOCK_BUSES.splice(index, 1);
      console.warn('Bus removed from MOCK ', removed[0]);
      return { message: 'Bus removed from mock data' };
    }

    return { message: 'Bus not found in mock data' };
  }


async getRoutes(): Promise<{ routes: RouteModel[] }> {
  console.warn('Using MOCK DATA for routes ');
  return { routes: MOCK_ROUTES };
}

async createRoute(payload: Partial<RouteModel>): Promise<any> {

  const newRoute: RouteModel = {
    id: (MOCK_ROUTES.length + 1).toString(),
    busNumber: payload.busNumber || '',
    routeName: payload.routeName || 'New Route',
    stops: payload.stops || [],
    startTime: payload.startTime || '06:00 AM',
    endTime: payload.endTime || '10:00 PM',
    frequency: payload.frequency || '15 min'
  };

  MOCK_ROUTES.push(newRoute);

  console.warn('Route added to MOCK ', newRoute);

  return { message: 'Route added to mock data', route: newRoute };
}

async deleteRoute(routeId: string): Promise<any> {

  const index = MOCK_ROUTES.findIndex(r => r.id === routeId);

  if (index !== -1) {
    const removed = MOCK_ROUTES.splice(index, 1);

    console.warn('Route removed from MOCK ', removed[0]);

    return { message: 'Route removed from mock data' };
  }

  return { message: 'Route not found in mock data' };
}
async editBus(busId: string, payload: Partial<Bus>): Promise<any> {
  const bus = MOCK_BUSES.find(b => b.id === busId);
  if (!bus) {
    return { message: 'Bus not found in mock data' };
  }

  bus.number = payload.number ?? bus.number;
  bus.capacity = payload.capacity ?? bus.capacity;
  bus.routeName = payload.routeName ?? bus.routeName;
  bus.status = payload.status ?? bus.status;

  console.warn('Bus updated in MOCK ', bus);
  return { message: 'Bus updated in mock data', bus };
}

async editRoute(routeId: string, payload: Partial<RouteModel>): Promise<any> {
  const route = MOCK_ROUTES.find(r => r.id === routeId);
  if (!route) {
    return { message: 'Route not found in mock data' };
  }

  route.busNumber = payload.busNumber ?? route.busNumber;
  route.routeName = payload.routeName ?? route.routeName;
  route.stops = payload.stops ?? route.stops;
  route.startTime = payload.startTime ?? route.startTime;
  route.endTime = payload.endTime ?? route.endTime;
  route.frequency = payload.frequency ?? route.frequency;

  console.warn('Route updated in MOCK ', route);
  return { message: 'Route updated in mock data', route };
}


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
