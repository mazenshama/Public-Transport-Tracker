// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { delay } from 'rxjs/operators';

// export interface Bus {
//   id: string;
//   number: string;
//   status: 'available' | 'active' | 'out-of-service';
//   routeName?: string;
//   currentDriverId?: string;
// }

// export interface LocationData {
//   lat: number;
//   lng: number;
//   heading?: number;
//   timestamp?: number;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {
//   private mockBuses: Bus[] = [
//     {
//       id: 'bus-001',
//       number: '101',
//       status: 'available',
//       routeName: 'Downtown Express',
//     },
//     {
//       id: 'bus-002',
//       number: '102',
//       status: 'available',
//       routeName: 'Uptown Local',
//     },
//     {
//       id: 'bus-003',
//       number: '103',
//       status: 'available',
//       routeName: 'Airport Shuttle',
//     },
//     {
//       id: 'bus-004',
//       number: '104',
//       status: 'out-of-service',
//       routeName: 'Beach Route',
//     },
//   ];

//   private busesSubject = new BehaviorSubject<Bus[]>(this.mockBuses);
//   buses$ = this.busesSubject.asObservable();

//   constructor() {}

//   getBuses(): Observable<{ buses: Bus[] }> {
//     return of({ buses: this.mockBuses }).pipe(delay(300));
//   }

//   startTrip(busId: string): Observable<{ success: boolean }> {
//     const bus = this.mockBuses.find((b) => b.id === busId);
//     if (bus) {
//       bus.status = 'active';
//       bus.currentDriverId = 'driver-001';
//       this.busesSubject.next([...this.mockBuses]);
//     }
//     return of({ success: true }).pipe(delay(300));
//   }

//   endTrip(busId: string): Observable<{ success: boolean }> {
//     const bus = this.mockBuses.find((b) => b.id === busId);
//     if (bus) {
//       bus.status = 'available';
//       bus.currentDriverId = undefined;
//       this.busesSubject.next([...this.mockBuses]);
//     }
//     return of({ success: true }).pipe(delay(300));
//   }

//   updateLocation(
//     busId: string,
//     latitude: number,
//     longitude: number,
//     heading: number = 0
//   ): Observable<{ success: boolean }> {
//     // In a real app, this would send to a backend
//     return of({ success: true }).pipe(delay(100));
//   }

//   reportIssue(
//     busId: string,
//     issueType: string,
//     description: string
//   ): Observable<{ success: boolean }> {
//     const bus = this.mockBuses.find((b) => b.id === busId);
//     if (bus) {
//       bus.status = 'out-of-service';
//       this.busesSubject.next([...this.mockBuses]);
//     }
//     return of({ success: true }).pipe(delay(300));
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface LocationData {
  lat: number;
  lng: number;
  heading?: number;
  timestamp?: number;
}

export interface Station {
  name: string;
  lat: number;
  lng: number;
  reached?: boolean;
}

export interface Bus {
  id: string;
  number: string;
  status: 'available' | 'active' | 'out-of-service';
  routeName?: string;
  currentDriverId?: string;
  stations?: Station[];
  currentLocation?: LocationData;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private mockBuses: Bus[] = [
    {
      id: 'bus-001',
      number: '101',
      status: 'available',
      routeName: 'Downtown Express',
      stations: [
        { name: 'Station A', lat: 30.060, lng: 31.220 },
        { name: 'Station B', lat: 30.062, lng: 31.225 },
        { name: 'Station C', lat: 30.065, lng: 31.230 },
      ]
    },
    {
      id: 'bus-002',
      number: '102',
      status: 'available',
      routeName: 'Uptown Local',
      stations: [
        { name: 'Station D', lat: 30.070, lng: 31.235 },
        { name: 'Station E', lat: 30.075, lng: 31.240 },
      ]
    }
  ];

  private busesSubject = new BehaviorSubject<Bus[]>([...this.mockBuses]);
  buses$ = this.busesSubject.asObservable();

  constructor() {}

  getBuses(): Observable<{ buses: Bus[] }> {
    return of({ buses: [...this.mockBuses] }).pipe(delay(200));
  }

  startTrip(busId: string, driverId: string): Observable<{ success: boolean }> {
    const bus = this.mockBuses.find(b => b.id === busId);
    if (bus) {
      bus.status = 'active';
      bus.currentDriverId = driverId;
      bus.stations?.forEach(s => s.reached = false);
      this.busesSubject.next([...this.mockBuses]);
    }
    return of({ success: true }).pipe(delay(200));
  }

  endTrip(busId: string): Observable<{ success: boolean }> {
    const bus = this.mockBuses.find(b => b.id === busId);
    if (bus) {
      bus.status = 'available';
      bus.currentDriverId = undefined;
      bus.currentLocation = undefined;
      this.busesSubject.next([...this.mockBuses]);
    }
    return of({ success: true }).pipe(delay(200));
  }

  updateLocation(busId: string, lat: number, lng: number, heading: number = 0): Observable<{ success: boolean }> {
    const bus = this.mockBuses.find(b => b.id === busId);
    if (bus) {
      bus.currentLocation = { lat, lng, heading, timestamp: Date.now() };
      this.busesSubject.next([...this.mockBuses]);
    }
    return of({ success: true }).pipe(delay(50));
  }

  recordStation(busId: string, stationName: string): Observable<{ success: boolean }> {
    const bus = this.mockBuses.find(b => b.id === busId);
    if (bus?.stations) {
      const st = bus.stations.find(s => s.name === stationName);
      if (st) st.reached = true;
      this.busesSubject.next([...this.mockBuses]);
    }
    return of({ success: true }).pipe(delay(50));
  }

  reportIssue(busId: string, issueType: string, description: string): Observable<{ success: boolean }> {
    const bus = this.mockBuses.find(b => b.id === busId);
    if (bus) {
      bus.status = 'out-of-service';
      this.busesSubject.next([...this.mockBuses]);
    }
    return of({ success: true }).pipe(delay(200));
  }
}
