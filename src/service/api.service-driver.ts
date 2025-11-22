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
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { environment } from '../environments/environment';

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

interface ApiResponse<T> {
  success?: boolean;
  buses?: Bus[];
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  // private apiUrl = environment.apiBaseUrl || 'https://publictransporttraker.runasp.net/api/admin';
private apiUrl = `${environment.apiBaseUrl}/driver`;
  constructor(private http: HttpClient) {}

  getBuses(): Observable<{ buses: Bus[] }> {
    return this.http.get<{ buses: Bus[] }>(`${this.apiUrl}/buses`)
      .pipe(
        catchError(error => {
          console.error('Error fetching buses:', error);
          // Fallback to empty array on error
          return of({ buses: [] });
        })
      );
  }

  startTrip(busId: string, driverId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/start-trip`, {
      busId: busId,
      driverId: driverId
    }).pipe(
      catchError(error => {
        console.error('Error starting trip:', error);
        return throwError(() => error);
      })
    );
  }

  endTrip(busId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/end-trip`, {
      busId: busId
    }).pipe(
      catchError(error => {
        console.error('Error ending trip:', error);
        return throwError(() => error);
      })
    );
  }

  updateLocation(busId: string, lat: number, lng: number, heading: number = 0): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/update-location`, {
      busId: busId,
      latitude: lat,
      longitude: lng,
      heading: heading
    }).pipe(
      catchError(error => {
        console.error('Error updating location:', error);
        // Don't throw error for location updates to avoid disrupting tracking
        return of({ success: false });
      })
    );
  }

  recordStation(busId: string, stationName: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/record-station`, {
      busId: busId,
      stationName: stationName
    }).pipe(
      catchError(error => {
        console.error('Error recording station:', error);
        return of({ success: false });
      })
    );
  }

  reportIssue(busId: string, issueType: string, description: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/report-issue`, {
      busId: busId,
      issueType: issueType,
      description: description
    }).pipe(
      catchError(error => {
        console.error('Error reporting issue:', error);
        return throwError(() => error);
      })
    );
  }

  /**  Restore a bus that was out-of-service */
  restoreBus(busId: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/restore-bus`, { busId })
      .pipe(
        catchError(error => {
          console.error('Error restoring bus:', error);
          return throwError(() => error);
        })
      );
  }
}

