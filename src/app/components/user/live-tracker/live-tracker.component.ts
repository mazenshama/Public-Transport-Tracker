import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import * as L from 'leaflet';

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
export class LiveTrackerComponent implements OnInit, AfterViewInit, OnDestroy {
  buses: Bus[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  private apiUrl = environment.apiBaseUrl || 'https://localhost:7114';
  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();
  private pollingInterval?: any;
  private defaultCenter: [number, number] = [30.0444, 31.2357]; // Cairo, Egypt (default location)
  private defaultZoom: number = 12;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  ngAfterViewInit(): void {
    this.initMap();
    // Start polling after initial load
    setTimeout(() => {
      this.startPolling();
    }, 2000);
  }

  ngOnDestroy(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Initialize the map
    this.map = L.map('busMap', {
      center: this.defaultCenter,
      zoom: this.defaultZoom
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private createBusIcon(busNumber: string): L.DivIcon {
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div class="bus-marker-container">
          <div class="bus-icon">🚌</div>
          <div class="bus-number-badge">${busNumber}</div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    });
  }

  private updateMarkers(): void {
    // Remove markers for buses that no longer have location data
    this.markers.forEach((marker, busId) => {
      const bus = this.buses.find(b => b.id === busId);
      if (!bus || !this.hasLocation(bus)) {
        this.map.removeLayer(marker);
        this.markers.delete(busId);
      }
    });

    // Add or update markers for buses with location data
    this.buses.forEach(bus => {
      if (this.hasLocation(bus) && bus.currentLatitude && bus.currentLongitude) {
        const position: L.LatLngExpression = [bus.currentLatitude, bus.currentLongitude];
        
        if (this.markers.has(bus.id)) {
          // Update existing marker position
          const marker = this.markers.get(bus.id)!;
          marker.setLatLng(position);
          
          // Update popup content
          const popupContent = this.getPopupContent(bus);
          marker.setPopupContent(popupContent);
        } else {
          // Create new marker
          const icon = this.createBusIcon(bus.number);
          const marker = L.marker(position, { icon })
            .addTo(this.map)
            .bindPopup(this.getPopupContent(bus));
          
          this.markers.set(bus.id, marker);
        }
      }
    });

    // Fit map to show all markers if there are any
    if (this.markers.size > 0) {
      const bounds = L.latLngBounds(
        Array.from(this.markers.values()).map(m => m.getLatLng())
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getPopupContent(bus: Bus): string {
    return `
      <div style="text-align: center; padding: 5px;">
        <strong>Bus ${bus.number}</strong><br>
        ${bus.routeName ? `Route: ${bus.routeName}<br>` : ''}
        Status: ${bus.status}<br>
        ${bus.currentLatitude && bus.currentLongitude 
          ? `Location: ${bus.currentLatitude.toFixed(4)}, ${bus.currentLongitude.toFixed(4)}` 
          : ''}
      </div>
    `;
  }

  private simulateMovement(): void {
    // Simulate live movement by slightly updating coordinates
    this.buses.forEach(bus => {
      if (this.hasLocation(bus) && bus.currentLatitude && bus.currentLongitude) {
        // Add small random movement (0.0001 to 0.0005 degrees)
        const latChange = (Math.random() - 0.5) * 0.0005;
        const lngChange = (Math.random() - 0.5) * 0.0005;
        
        bus.currentLatitude += latChange;
        bus.currentLongitude += lngChange;
      } else if (bus.status === 'active') {
        // If bus is active but has no location, assign a random location near the center
        bus.currentLatitude = this.defaultCenter[0] + (Math.random() - 0.5) * 0.1;
        bus.currentLongitude = this.defaultCenter[1] + (Math.random() - 0.5) * 0.1;
      }
    });
    
    // Update markers on the map
    this.updateMarkers();
  }

  private startPolling(): void {
    // Poll every 8 seconds to simulate live movement
    this.pollingInterval = setInterval(() => {
      this.simulateMovement();
    }, 8000);
  }

  loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<{ buses: Bus[] }>(`${this.apiUrl}/api/bus`)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.buses = response.buses || [];
          
          // Initialize locations for buses without coordinates
          this.buses.forEach(bus => {
            if (bus.status === 'active' && !this.hasLocation(bus)) {
              // Assign random location near center for active buses without location
              bus.currentLatitude = this.defaultCenter[0] + (Math.random() - 0.5) * 0.1;
              bus.currentLongitude = this.defaultCenter[1] + (Math.random() - 0.5) * 0.1;
            }
          });
          
          // Update markers after loading buses
          if (this.map) {
            setTimeout(() => this.updateMarkers(), 100);
          }
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
