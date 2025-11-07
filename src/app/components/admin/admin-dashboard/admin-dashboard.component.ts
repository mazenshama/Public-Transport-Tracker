import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Bus, RouteModel, Contact, Tracking } from '../../../../service/api.service-admin';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule, DatePipe],
})
export class AdminDashboardComponent implements OnInit {
  buses: Bus[] = [];
  routes: RouteModel[] = [];
  contacts: Contact[] = [];
  tracking: Tracking[] = [];

  stats = {
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    pendingContacts: 0,
  };

  newBus = { number: '', capacity: 0, routeName: '', status: 'active' };
  newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };

  constructor(private api: ApiService) {}

  async ngOnInit() {
    try {
      const busesData = await this.api.getBuses();
      this.buses = busesData?.buses || [];

      const routesData = await this.api.getRoutes();
      this.routes = routesData?.routes || [];

      const contactsData = await this.api.getContacts();
      this.contacts = contactsData?.contacts || [];

      const trackingData = await this.api.getAllTracking();
      this.tracking = trackingData?.tracking || [];

      this.updateStats();
    } catch {
      console.warn(' API offline — using mock data');

      this.buses = [
        { id: '1', number: '15A', capacity: 40, routeName: 'Downtown', status: 'active' },
        { id: '2', number: '22B', capacity: 35, routeName: 'Airport', status: 'inactive' },
      ];
      this.routes = [
        {
          id: '1',
          busNumber: '15A',
          routeName: 'Downtown',
          stops: ['Stop 1', 'Stop 2'],
          startTime: '8:00',
          endTime: '17:00',
          frequency: '30 min',
        },
      ];
      this.contacts = [
        {
          id: '1',
          name: 'Ali Ahmed',
          message: 'Bus delayed',
          email: 'ali@example.com',
          submittedAt: new Date().toISOString(),
        },
      ];
      this.tracking = [
        { busId: '1', heading: 120, timestamp: new Date().toISOString() },
        { busId: '2', heading: 90, timestamp: new Date().toISOString() },
      ];

      this.updateStats();
    }
  }

  updateStats() {
    this.stats = {
      totalBuses: this.buses.length,
      activeBuses: this.buses.filter((b) => b.status === 'active').length,
      totalRoutes: this.routes.length,
      pendingContacts: this.contacts.length,
    };
  }

  async addBus() {
    if (!this.newBus.number || !this.newBus.capacity) return;

    try {
      await this.api.createBus(this.newBus);
      const res = await this.api.getBuses();
      this.buses = res.buses;
    } catch {
      this.buses.push({ ...this.newBus, id: (Math.random() * 1000).toFixed(0) });
    }

    this.newBus = { number: '', capacity: 0, routeName: '', status: 'active' };
    this.updateStats();
  }

  async deleteBus(busId: string) {
    try {
      await this.api.deleteBus(busId);
      const res = await this.api.getBuses();
      this.buses = res.buses;
    } catch {
      this.buses = this.buses.filter((b) => b.id !== busId);
    }
    this.updateStats();
  }

  async addRoute() {
    const stops = this.newRoute.stops.split(',').map((s) => s.trim());
    try {
      await this.api.createRoute({ ...this.newRoute, stops });
      const res = await this.api.getRoutes();
      this.routes = res.routes;
    } catch {
      this.routes.push({ ...this.newRoute, stops, id: (Math.random() * 1000).toFixed(0) });
    }

    this.newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };
    this.updateStats();
  }

  async deleteRoute(routeId: string) {
    try {
      await this.api.deleteRoute(routeId);
      const res = await this.api.getRoutes();
      this.routes = res.routes;
    } catch {
      this.routes = this.routes.filter((r) => r.id !== routeId);
    }
    this.updateStats();
  }
}
