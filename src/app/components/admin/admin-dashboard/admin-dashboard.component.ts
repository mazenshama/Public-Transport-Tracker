
import { Component, OnInit } from '@angular/core';
import { ApiService, Bus, RouteModel, Contact, Tracking } from '../../../../service/api.service-admin';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, DatePipe],
  standalone: true
})
export class AdminDashboardComponent implements OnInit {
  buses: Bus[] = [];
  routes: RouteModel[] = [];
  contacts: Contact[] = [];
  tracking: Tracking[] = [];

  newBus = { number: '', capacity: 0, routeName: '' };
  newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    const busesData = await this.apiService.getBuses();
    this.buses = busesData.buses;

    const routesData = await this.apiService.getRoutes();
    this.routes = routesData.routes;

    const contactsData = await this.apiService.getContacts();
    this.contacts = contactsData.contacts;

    const trackingData = await this.apiService.getAllTracking();
    this.tracking = trackingData.tracking;
  }

  async createBus() {
    if (!this.newBus.number || !this.newBus.capacity) return;
    await this.apiService.createBus(this.newBus);
    const res = await this.apiService.getBuses();
    this.buses = res.buses;
    this.newBus = { number: '', capacity: 0, routeName: '' };
  }

  async deleteBus(busId: string) {
    await this.apiService.deleteBus(busId);
    const res = await this.apiService.getBuses();
    this.buses = res.buses;
  }

  async createRoute() {
    const stops = this.newRoute.stops.split(',').map(s => s.trim());
    await this.apiService.createRoute({ ...this.newRoute, stops });
    const res = await this.apiService.getRoutes();
    this.routes = res.routes;
    this.newRoute = { busNumber: '', routeName: '', stops: '', startTime: '', endTime: '', frequency: '' };
  }

  async deleteRoute(routeId: string) {
    await this.apiService.deleteRoute(routeId);
    const res = await this.apiService.getRoutes();
    this.routes = res.routes;
  }
}
