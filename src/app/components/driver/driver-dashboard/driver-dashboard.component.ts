import { Component, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { ApiService, Bus, Station, LocationData } from '../../../../service/api.service-driver';
import { AuthServices } from '../../../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-dashboard',
  templateUrl: './driver-dashboard.component.html',
  styleUrls: ['./driver-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class DriverDashboardComponent implements OnInit, OnDestroy {
  buses = signal<Bus[]>([]);
  selectedBus = signal('');
  currentBus = signal<Bus | null>(null);
  isTracking = signal(false);
  issueType = signal('');
  issueDescription = signal('');
  location = signal<LocationData | null>(null);
  availableBuses = signal<Bus[]>([]);
  user = signal<{ id: string; name: string; email: string; role: string } | null>(null);

  private watchId: number | null = null;

  constructor(private apiService: ApiService, private authService: AuthServices) {
    effect(() => {
      const filtered = this.buses().filter(b => {
        const status = (b.status || '').toLowerCase();
        return status !== 'active' && status !== 'out-of-service';
      });
      console.log('Filtering buses. Total:', this.buses().length, 'Available:', filtered.length);
      this.availableBuses.set(filtered);
    }, { allowSignalWrites: true });

    effect(() => {
        if (this.isTracking() && this.currentBus()) {
             this.watchId = navigator.geolocation.watchPosition(pos => {
                const { latitude, longitude, heading } = pos.coords;
                this.location.set({ lat: latitude, lng: longitude });

                this.apiService.updateLocation(this.currentBus()!.id, latitude, longitude, heading || 0)
                  .subscribe();

                this.checkStations(latitude, longitude);
             }, e => console.error(e), { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 });
        } else {
             this.stopLocationTracking();
        }
    });

  }

  ngOnInit(): void {
    const currentUser = this.authService.getUser();
    console.log('Current user:', currentUser);
    this.user.set(currentUser);
    this.fetchBuses();
  }

  ngOnDestroy(): void {
    this.stopLocationTracking();
  }

  fetchBuses(): void {
    console.log('Fetching buses...');
    this.apiService.getBuses().subscribe({
      next: (res) => {
        console.log('Buses response:', res);
        console.log('Response type:', typeof res);
        console.log('Response keys:', Object.keys(res || {}));

        if (res && res.buses) {
          console.log('Buses array:', res.buses);
          console.log('Buses count:', res.buses.length);
          console.log('First bus:', res.buses[0]);

          const processedBuses: Bus[] = res.buses.map(bus => {
            const statusLower = (bus.status || 'available').toLowerCase();
            const validStatus: 'available' | 'active' | 'out-of-service' =
              (statusLower === 'active' || statusLower === 'out-of-service')
                ? statusLower as 'active' | 'out-of-service'
                : 'available';

            return {
              ...bus,
              status: validStatus
            };
          });

          this.buses.set(processedBuses);
          console.log('Buses signal set:', this.buses().length);
          console.log('Available buses:', this.availableBuses().length);

          const activeBus = processedBuses.find(b => b.currentDriverId === this.user()?.id && b.status === 'active');
          if (activeBus) {
            this.currentBus.set(activeBus);
            this.selectedBus.set(activeBus.id);
            this.isTracking.set(true);
          }
        } else {
          console.warn('No buses in response. Response:', res);
          this.buses.set([]);
        }
      },
      error: (error) => {
        console.error('Error fetching buses:', error);
        console.error('Error details:', error.error, error.status, error.statusText);
        this.buses.set([]);
      }
    });
  }

handleStartTrip(): void {
  if (!this.selectedBus()) {
      alert('Please select a bus.');
      return;
  }

  const driverId = this.user()?.id;
  console.log('Sending Bus ID:', this.selectedBus());
  console.log('Sending Driver ID:', driverId);

  if (!driverId) {
      alert('Driver ID not found. Please log in again.');
      return;
  }

  this.apiService.startTrip(this.selectedBus(), driverId).subscribe({
      next: () => {
          this.fetchBuses();
          this.isTracking.set(true);
      },
      error: (error) => {
          alert(`Failed to start trip: ${error?.message || 'Bus may be active or ID is invalid.'}`);
          console.error('Start Trip Error:', error);
      }
  });
}

  handleEndTrip(): void {
    if (!this.currentBus()) return;
    this.apiService.endTrip(this.currentBus()!.id).subscribe(() => {
      this.currentBus.set(null);
      this.isTracking.set(false);
      this.selectedBus.set('');
      this.fetchBuses();
    });
  }

  handleReportIssue(): void {
    if (!this.currentBus() || !this.issueType() || !this.issueDescription()) return;
    this.apiService.reportIssue(this.currentBus()!.id, this.issueType(), this.issueDescription()).subscribe(() => {
      this.currentBus.set(null);
      this.isTracking.set(false);
      this.issueType.set('');
      this.issueDescription.set('');
      this.fetchBuses();
    });
  }

  handleRestoreBus(busId: string): void {
    this.apiService.restoreBus(busId).subscribe(() => {
      alert('Bus restored to available');
      this.fetchBuses();
    });
  }


  private stopLocationTracking(): void {
    if (this.watchId !== null) navigator.geolocation.clearWatch(this.watchId);
  }

  private checkStations(lat: number, lng: number) {
    const bus = this.currentBus();
    if (!bus?.stations) return;

    const threshold = 0.0005;
    bus.stations.forEach(s => {
      if (!s.reached &&
          Math.abs(s.lat - lat) < threshold &&
          Math.abs(s.lng - lng) < threshold) {
        this.apiService.recordStation(bus.id, s.name).subscribe();
      }
    });
  }
}
