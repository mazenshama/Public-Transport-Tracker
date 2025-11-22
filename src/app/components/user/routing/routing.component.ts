import { Component, OnInit } from '@angular/core';
import { RouteModel } from '../../../../service/api.service-admin';
import { RoutesService } from '../../../../service/routes.service';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routing',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './routing.component.html',
  styleUrl: './routing.component.css'
})
export class RoutingComponent implements OnInit {

  routes: RouteModel[] = [];
  searchBusNumber = '';
  searchByDestination = '';

  constructor(private routesService: RoutesService) {}

  async ngOnInit() {
    this.routes = await this.routesService.getRoutes();
  }

 get filteredRoutes() {
  if (!this.searchBusNumber && !this.searchByDestination) {
    return this.routes;
  }

  return this.routes.filter(r => {
    const matchBus =
      !this.searchBusNumber ||
      r.busNumber.toLowerCase().includes(this.searchBusNumber.toLowerCase());

    const matchDestination =
      !this.searchByDestination ||
      r.routeName.toLowerCase().includes(this.searchByDestination.toLowerCase()) ||
      r.stops.some(stop =>
        stop.toLowerCase().includes(this.searchByDestination.toLowerCase())
      );

    return matchBus && matchDestination;
  });

}}
