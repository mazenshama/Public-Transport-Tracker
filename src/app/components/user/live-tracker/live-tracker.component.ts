import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TrackerService, Bus, BusLocation } from '../../../../service/tracker.service';
import * as L from 'leaflet';

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
  selectedBus: Bus | null = null;

  private map!: L.Map;
  private markers: Map<string, L.Marker> = new Map();
  private pollingInterval?: any;
  private defaultCenter: [number, number] = [30.0444, 31.2357]; // القاهرة
  private defaultZoom: number = 12;

  constructor(private trackerService: TrackerService) {}

  ngOnInit(): void {
    this.loadBuses();
  }

  ngAfterViewInit(): void {
    this.initMap();
    // بدء التحديث التلقائي بعد التحميل الأولي
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
    this.map = L.map('busMap', {
      center: this.defaultCenter,
      zoom: this.defaultZoom
    });

    // إضافة خريطة OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private createBusIcon(busNumber: string, status: string): L.DivIcon {
    const color = status === 'active' ? '#2f72ff' : '#6c757d';
    
    return L.divIcon({
      className: 'custom-bus-marker',
      html: `
        <div class="bus-marker-container">
          <div class="bus-icon" style="color: ${color}">🚌</div>
          <div class="bus-number-badge" style="background: ${color}">${busNumber}</div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [0, -50]
    });
  }

  private updateMarkers(): void {
    // إزالة markers للباصات التي لم تعد لديها بيانات موقع
    this.markers.forEach((marker, busId) => {
      const bus = this.buses.find(b => b.id === busId);
      if (!bus || !this.hasLocation(bus)) {
        this.map.removeLayer(marker);
        this.markers.delete(busId);
      }
    });

    // إضافة أو تحديث markers للباصات التي لديها بيانات موقع
    this.buses.forEach(bus => {
      if (this.hasLocation(bus) && bus.currentLatitude && bus.currentLongitude) {
        const position: L.LatLngExpression = [bus.currentLatitude, bus.currentLongitude];
        
        if (this.markers.has(bus.id)) {
          // تحديث موقع الـ marker الموجود
          const marker = this.markers.get(bus.id)!;
          marker.setLatLng(position);
          
          // تحديث محتوى الـ popup
          const popupContent = this.getPopupContent(bus);
          marker.setPopupContent(popupContent);
        } else {
          // إنشاء marker جديد
          const icon = this.createBusIcon(bus.number, bus.status);
          const marker = L.marker(position, { icon })
            .addTo(this.map)
            .bindPopup(this.getPopupContent(bus));
          
          // إضافة event listener للنقر على الـ marker
          marker.on('click', () => {
            this.onBusSelect(bus);
          });
          
          this.markers.set(bus.id, marker);
        }
      }
    });

    // ضبط الخريطة لإظهار جميع الـ markers إذا كان هناك أي منها
    if (this.markers.size > 0) {
      const bounds = L.latLngBounds(
        Array.from(this.markers.values()).map(m => m.getLatLng())
      );
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  private getPopupContent(bus: Bus): string {
    return `
      <div style="text-align: center; padding: 5px; min-width: 150px;">
        <strong>Bus ${bus.number}</strong><br>
        ${bus.routeName ? `Route: ${bus.routeName}<br>` : ''}
        Status: <span style="color: ${bus.status === 'active' ? 'green' : 'gray'}">${bus.status}</span><br>
        ${bus.currentLatitude && bus.currentLongitude 
          ? `Location: ${bus.currentLatitude.toFixed(4)}, ${bus.currentLongitude.toFixed(4)}` 
          : 'No location data'}
        <br><br>
        <button onclick="this.closest('.leaflet-popup')._source._map.closePopup();" 
                style="background: #2f72ff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
          إغلاق
        </button>
      </div>
    `;
  }

  private loadLiveLocations(): void {
    this.trackerService.getLiveLocations().subscribe({
      next: (locations: BusLocation[]) => {
        // تحديث مواقع الباصات بناءً على البيانات الحية
        locations.forEach(location => {
          const bus = this.buses.find(b => b.id === location.busId);
          if (bus) {
            bus.currentLatitude = location.latitude;
            bus.currentLongitude = location.longitude;
          }
        });
        
        // تحديث الـ markers على الخريطة
        this.updateMarkers();
      },
      error: (error) => {
        console.error('Error loading live locations:', error);
        // في حالة الخطأ، نستخدم البيانات المحاكاة
        this.simulateMovement();
      }
    });
  }

  private simulateMovement(): void {
    // محاكاة الحركة الحية في حالة عدم توفر بيانات حقيقية
    this.buses.forEach(bus => {
      if (bus.status === 'active') {
        if (this.hasLocation(bus) && bus.currentLatitude && bus.currentLongitude) {
          // إضافة حركة عشوائية صغيرة
          const latChange = (Math.random() - 0.5) * 0.0005;
          const lngChange = (Math.random() - 0.5) * 0.0005;
          
          bus.currentLatitude += latChange;
          bus.currentLongitude += lngChange;
        } else {
          // إذا كان الباص نشط ولكن ليس لديه موقع، نعين موقع عشوائي بالقرب من المركز
          bus.currentLatitude = this.defaultCenter[0] + (Math.random() - 0.5) * 0.1;
          bus.currentLongitude = this.defaultCenter[1] + (Math.random() - 0.5) * 0.1;
        }
      }
    });
    
    this.updateMarkers();
  }

  private startPolling(): void {
    // التحديث كل 5 ثواني لجلب البيانات الحية
    this.pollingInterval = setInterval(() => {
      this.loadLiveLocations();
    }, 5000);
  }

  loadBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.trackerService.getAllBuses().subscribe({
      next: (buses: Bus[]) => {
        this.isLoading = false;
        this.buses = buses;
        
        // تحميل المواقع الأولية للباصات النشطة
        this.loadLiveLocations();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'فشل في تحميل الباصات. يرجى المحاولة مرة أخرى لاحقاً.';
        console.error('Error loading buses:', error);
        this.buses = [];
      }
    });
  }

  // دالة اختيار الباص من القائمة
  onBusSelect(bus: Bus): void {
    this.selectedBus = bus;
    
    // التركيز على الباص المحدد في الخريطة
    if (this.hasLocation(bus) && bus.currentLatitude && bus.currentLongitude) {
      const marker = this.markers.get(bus.id);
      if (marker) {
        this.map.setView(marker.getLatLng(), 15);
        marker.openPopup();
      }
    }
    
    // إضافة تأثير مرئي للباص المحدد
    this.highlightSelectedBus(bus.id);
  }

  // إبراز الباص المحدد
  private highlightSelectedBus(busId: string): void {
    this.markers.forEach((marker, id) => {
      if (id === busId) {
        // تكبير الـ marker المحدد
        marker.setZIndexOffset(1000);
      } else {
        marker.setZIndexOffset(0);
      }
    });
  }

  // تحديث البيانات
  refreshData(): void {
    this.loadBuses();
    if (this.selectedBus) {
      // إعادة تحميل بيانات الباص المحدد
      this.trackerService.getBusById(this.selectedBus.id).subscribe({
        next: (bus) => {
          const index = this.buses.findIndex(b => b.id === bus.id);
          if (index !== -1) {
            this.buses[index] = { ...this.buses[index], ...bus };
            this.updateMarkers();
          }
        },
        error: (error) => {
          console.error('Error refreshing bus data:', error);
        }
      });
    }
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
      return `الخط: ${bus.routeName} - الحالة: ${this.getStatusText(bus.status)}`;
    }
    return `الحالة: ${this.getStatusText(bus.status)}`;
  }

  private getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'نشط',
      'inactive': 'غير نشط',
      'maintenance': 'صيانة',
      'offline': 'غير متصل'
    };
    return statusMap[status] || status;
  }

  hasLocation(bus: Bus): boolean {
    return bus.currentLatitude != null && bus.currentLongitude != null;
  }

  get activeBusesWithLocationCount(): number {
    return this.buses.filter((bus) => this.hasLocation(bus) && bus.status === 'active').length;
  }

  // الحصول على فئة CSS للباص المحدد
  getBusCardClass(bus: Bus): string {
    return this.selectedBus?.id === bus.id ? 'bus-card selected' : 'bus-card';
  }
}