import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
<<<<<<< Updated upstream
import { ApiService, Bus, RouteModel, Contact, Tracking } from '../../../../service/api.service-admin';
=======
import { ApiService, Bus, RouteModel, Contact, Tracking } from '../../service/api.service-admin';
>>>>>>> Stashed changes

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule, DatePipe],
})
export class AdminDashboardComponent implements OnInit {
<<<<<<< Updated upstream
=======
  // بيانات عامة
>>>>>>> Stashed changes
  buses: Bus[] = [];
  routes: RouteModel[] = [];
  contacts: Contact[] = [];
  tracking: Tracking[] = [];

<<<<<<< Updated upstream
=======
  // الإحصائيات
>>>>>>> Stashed changes
  stats = {
    totalBuses: 0,
    activeBuses: 0,
    totalRoutes: 0,
    pendingContacts: 0,
  };

<<<<<<< Updated upstream
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
=======
  // كائنات الإدخال
  newBus = { number: '', capacity: 0, routeName: '', status: 'active' };
  newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };

  constructor(private api: ApiService) {}

  // جلب البيانات من السيرفر
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
      console.warn('⚠️ API offline — using mock data');

      // بيانات تجريبية
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

>>>>>>> Stashed changes
      this.updateStats();
    }
  }

<<<<<<< Updated upstream
=======
  // تحديث الإحصائيات
>>>>>>> Stashed changes
  updateStats() {
    this.stats = {
      totalBuses: this.buses.length,
      activeBuses: this.buses.filter((b) => b.status === 'active').length,
      totalRoutes: this.routes.length,
      pendingContacts: this.contacts.length,
    };
  }

<<<<<<< Updated upstream
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
=======
  // إضافة حافلة جديدة
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

  // حذف حافلة
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

  // إضافة مسار جديد
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

  // حذف مسار
  async deleteRoute(routeId: string) {
    try {
      await this.api.deleteRoute(routeId);
      const res = await this.api.getRoutes();
      this.routes = res.routes;
    } catch {
      this.routes = this.routes.filter((r) => r.id !== routeId);
    }
    this.updateStats();
>>>>>>> Stashed changes
  }
}
