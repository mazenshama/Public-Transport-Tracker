import { routes } from './../../../app.routes';
import { Component, OnInit } from '@angular/core';
import { ApiService,RouteModel } from '../../../../service/api.service-admin';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgFor, NgForOf } from "@angular/common"
@Component({
  selector: 'app-routing',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './routing.component.html',
  styleUrl: './routing.component.css'
})
export class RoutingComponent implements OnInit{
  routes: RouteModel[] = [];
  searchBusNumber='';
  searchByDestination='';

  constructor (private api: ApiService){}

  async ngOnInit(){
    const res= await this.api.getRoutes();
    this.routes = res.routes;
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
        r.routeName.toLowerCase().includes(this.searchByDestination.toLowerCase());
      return matchBus && matchDestination;
    });
  }
}

