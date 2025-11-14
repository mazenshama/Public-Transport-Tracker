import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-live-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-tracker.component.html',
  styleUrl: './live-tracker.component.css'
})
export class LiveTrackerComponent implements AfterViewInit, OnDestroy {
  buses = [
    { number: 12, description: 'Bus heading downtown', coords: [30.0444, 31.2357] },
    { number: 7, description: 'Bus to station', coords: [30.056, 31.23] },
  ];

  map!: L.Map;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit(): void {
    // Wait for the next tick to ensure DOM is ready
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private initMap(): void {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // Initialize the map
    this.map = L.map('map', {
      center: [30.0444, 31.2357],
      zoom: 12,
      zoomControl: true,
      attributionControl: true
    });

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Fix icon issue in Leaflet
    this.fixLeafletIcon();

    // Add bus markers
    this.buses.forEach(bus => {
      const marker = L.marker(bus.coords as L.LatLngExpression).addTo(this.map);
      marker.bindPopup(`<b>Bus ${bus.number}</b><br>${bus.description}`);
    });

    // Handle map resize issues
    this.setupResizeHandler();

    // Final resize to ensure proper rendering
    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  private fixLeafletIcon(): void {
    // Fix for default markers in Leaflet
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }

  private setupResizeHandler(): void {
    // Use ResizeObserver to handle container resizing
    this.resizeObserver = new ResizeObserver(() => {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    });

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      this.resizeObserver.observe(mapContainer);
    }
  }
}