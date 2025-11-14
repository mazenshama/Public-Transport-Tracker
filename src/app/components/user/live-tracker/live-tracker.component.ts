import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Bus {
  id: string;
  number: string;
  status: string;
  routeName?: string;
  currentLatitude?: number;
  currentLongitude?: number;
}

@Component({
  selector: 'app-live-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './live-tracker.component.html',
  styleUrl: './live-tracker.component.css'
})
export class LiveTrackerComponent implements OnInit {
  buses: Bus[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = environment.apiBaseUrl || 'https://localhost:7000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<{ buses: Bus[] }>(`${this.apiUrl}/api/bus`)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.buses = response.buses || [];
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load buses. Please try again later.';
          console.error('Error loading buses:', error);
          this.buses = [];
        }
      });
  }

  get filteredBuses(): Bus[] {
    if (!this.searchQuery.trim()) {
      return this.buses;
    }

    const query = this.searchQuery.toLowerCase();
    return this.buses.filter(bus => 
      bus.number.toLowerCase().includes(query) ||
      bus.routeName?.toLowerCase().includes(query) ||
      bus.status.toLowerCase().includes(query)
    );
  }

  getBusDescription(bus: Bus): string {
    if (bus.routeName) {
      return `Route: ${bus.routeName} - Status: ${bus.status}`;
    }
    return `Status: ${bus.status}`;
  }

  hasLocation(bus: Bus): boolean {
    return bus.currentLatitude != null && bus.currentLongitude != null;
  }

  get activeBusesWithLocationCount(): number {
    return this.buses.filter((bus) => this.hasLocation(bus)).length;
  }
}
