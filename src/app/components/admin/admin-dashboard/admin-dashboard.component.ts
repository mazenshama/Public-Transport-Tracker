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

  activeTab: string = 'buses';
  showBusModal: boolean = false;
  showRouteModal: boolean = false;

  constructor(private api: ApiService) {}

  async ngOnInit() {
    try {
      // Load all data in parallel for better performance
      const [busesData, routesData, contactsData, trackingData] = await Promise.all([
        this.api.getBuses().catch(err => {
          console.error('Error loading buses:', err);
          return { buses: [] };
        }),
        this.api.getRoutes().catch(err => {
          console.error('Error loading routes:', err);
          return { routes: [] };
        }),
        this.api.getContacts().catch(err => {
          console.error('Error loading contacts:', err);
          return { contacts: [] };
        }),
        this.api.getAllTracking().catch(err => {
          console.error('Error loading tracking:', err);
          return { tracking: [] };
        })
      ]);

      this.buses = busesData?.buses || [];
      this.routes = routesData?.routes || [];
      this.contacts = contactsData?.contacts || [];
      this.tracking = trackingData?.tracking || [];

      this.updateStats();
    } catch (error) {
      console.error('Error initializing admin dashboard:', error);
      // Initialize with empty arrays instead of mock data
      this.buses = [];
      this.routes = [];
      this.contacts = [];
      this.tracking = [];
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
    if (!this.newBus.number || !this.newBus.capacity) {
      alert('Please fill in bus number and capacity');
      return;
    }

    try {
      const response = await this.api.createBus(this.newBus);
      if (response?.success) {
        // Reload buses from server
        const res = await this.api.getBuses();
        this.buses = res.buses;
        this.newBus = { number: '', capacity: 0, routeName: '', status: 'active' };
        this.showBusModal = false;
        this.updateStats();
      } else {
        alert('Failed to create bus. Please try again.');
      }
    } catch (error: any) {
      console.error('Error adding bus:', error);
      alert(error?.message || 'Failed to create bus. Please try again.');
    }
  }

  async deleteBus(busId: string) {
    if (!confirm('Are you sure you want to delete this bus?')) {
      return;
    }

    try {
      const response = await this.api.deleteBus(busId);
      if (response?.success) {
        // Reload buses from server
        const res = await this.api.getBuses();
        this.buses = res.buses;
        this.updateStats();
      } else {
        alert('Failed to delete bus. Please try again.');
      }
    } catch (error: any) {
      console.error('Error deleting bus:', error);
      alert(error?.message || 'Failed to delete bus. Please try again.');
    }
  }

  async addRoute() {
    if (!this.newRoute.routeName || !this.newRoute.busNumber) {
      alert('Please fill in route name and bus number');
      return;
    }

    const stops = this.newRoute.stops ? this.newRoute.stops.split(',').map((s) => s.trim()) : [];
    try {
      const response = await this.api.createRoute({ ...this.newRoute, stops });
      if (response?.success) {
        // Reload routes from server
        const res = await this.api.getRoutes();
        this.routes = res.routes;
        this.newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };
        this.showRouteModal = false;
        this.updateStats();
      } else {
        alert('Failed to create route. Please try again.');
      }
    } catch (error: any) {
      console.error('Error adding route:', error);
      alert(error?.message || 'Failed to create route. Please try again.');
    }
  }

  async deleteRoute(routeId: string) {
    if (!confirm('Are you sure you want to delete this route?')) {
      return;
    }

    try {
      const response = await this.api.deleteRoute(routeId);
      if (response?.success) {
        // Reload routes from server
        const res = await this.api.getRoutes();
        this.routes = res.routes;
        this.updateStats();
      } else {
        alert('Failed to delete route. Please try again.');
      }
    } catch (error: any) {
      console.error('Error deleting route:', error);
      alert(error?.message || 'Failed to delete route. Please try again.');
    }
  }
}
