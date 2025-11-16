
import { Injectable } from '@angular/core';

export interface Bus {
  id: string;
  number: string;
  capacity: number;
  routeName?: string;
  status: string; // 'active' | 'inactive' etc
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
  // Mock data arrays (initial sample data)
  private buses: Bus[] = [
    { id: 'b1', number: '12', capacity: 50, routeName: 'Arab Mall', status: 'active' },
    { id: 'b2', number: '5', capacity: 40, routeName: 'Ramses', status: 'inactive' },
  ];

  private routes: RouteModel[] = [
    { id: 'r1', busNumber: '12', routeName: 'Arab Mall', stops: ['Station A', 'Station B', 'Station C'], startTime: '06:00 AM', endTime: '11:00 PM', frequency: 'Every 15 minutes' },
  ];

  private contacts: Contact[] = [
    { id: 'c1', name: 'Ahmed', email: 'ahmed@example.com', phone: '010000000', subject: 'Delay', message: 'Bus 12 late today', submittedAt: new Date().toISOString() },
  ];

  private tracking: Tracking[] = [
    { busId: 'b1', latitude: 30.0444, longitude: 31.2357, heading: 120, timestamp: new Date().toISOString() },
  ];

  // small helper to generate id
  private genId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  }

  // Simulate network latency
  private delay<T>(result: T, ms = 200): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(result), ms));
  }

  // Buses
  async getBuses(): Promise<{ buses: Bus[] }> {
    return this.delay({ buses: [...this.buses] });

  }

  async createBus(payload: { number: any; capacity: any; routeName?: any }): Promise<any> {
    const newBus: Bus = {
      id: this.genId('b'),
      number: String(payload.number),
      capacity: Number(payload.capacity) || 0,
      routeName: payload.routeName ? String(payload.routeName) : undefined,
      status: 'active'
    };
    this.buses.push(newBus);
    return this.delay({ success: true, bus: newBus });
  }

  async deleteBus(busId: string): Promise<any> {
    this.buses = this.buses.filter(b => b.id !== busId);
    // also remove routes tied to this bus (optional)
    this.routes = this.routes.filter(r => r.busNumber !== busId && r.busNumber !== this.getBusNumberById(busId));
    return this.delay({ success: true });
  }

  private getBusNumberById(id: string) {
    const b = this.buses.find(x => x.id === id);
    return b ? b.number : id;
  }

  // Routes
  async getRoutes(): Promise<{ routes: RouteModel[] }> {
    return this.delay({ routes: [...this.routes] });
  }

  async createRoute(payload: Partial<RouteModel>): Promise<any> {
    const newRoute: RouteModel = {
      id: this.genId('r'),
      busNumber: String(payload.busNumber),
      routeName: String(payload.routeName || ''),
      stops: payload.stops ? [...payload.stops] : [],
      startTime: String(payload.startTime || ''),
      endTime: String(payload.endTime || ''),
      frequency: String(payload.frequency || ''),
    };
    this.routes.push(newRoute);
    return this.delay({ success: true, route: newRoute });
  }

  async deleteRoute(routeId: string): Promise<any> {
    this.routes = this.routes.filter(r => r.id !== routeId);
    return this.delay({ success: true });
  }

  // Contacts
  async getContacts(): Promise<{ contacts: Contact[] }> {
    return this.delay({ contacts: [...this.contacts] });
  }

  // Tracking
  async getAllTracking(): Promise<{ tracking: Tracking[] }> {
    return this.delay({ tracking: [...this.tracking] });
  }

  // Helper: push a fake tracking update (you can call this from console for testing)
  pushMockTrackingUpdate(update: Partial<Tracking>) {
    const t: Tracking = {
      busId: update.busId || (this.buses[0] && this.buses[0].id) || 'b_unknown',
      latitude: update.latitude ?? (30 + Math.random()),
      longitude: update.longitude ?? (31 + Math.random()),
      heading: update.heading ?? Math.floor(Math.random()*360),
      timestamp: new Date().toISOString()
    };
    // replace existing entry for this bus or add
    const idx = this.tracking.findIndex(x => x.busId === t.busId);
    if (idx >= 0) this.tracking[idx] = t;
    else this.tracking.push(t);
  }
}
