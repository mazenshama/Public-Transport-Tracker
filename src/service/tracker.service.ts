// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../environments/environment';

// export interface Bus {
//   id: string;
//   number: string;
//   status: string;
//   routeName?: string;
//   currentLatitude?: number;
//   currentLongitude?: number;
//   driverId?: string;
//   routeId?: string;
// }

// export interface BusLocation {
//   busId: string;
//   latitude: number;
//   longitude: number;
//   timestamp: Date;
//   speed?: number;
//   direction?: number;
// }

// export interface TripStatus {
//   busId: string;
//   isActive: boolean;
//   startTime?: Date;
//   endTime?: Date;
//   currentRoute?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class TrackerService {
//   private apiUrl = environment.apiBaseUrl;

//   constructor(private http: HttpClient) { }

//   // جلب جميع الباصات
//   getAllBuses(): Observable<Bus[]> {
//     return this.http.get<Bus[]>(`${this.apiUrl}/Bus`);
//   }

//   // جلب باص محدد بواسطة الـ ID
//   getBusById(busId: string): Observable<Bus> {
//     return this.http.get<Bus>(`${this.apiUrl}/Bus/${busId}`);
//   }

//   // جلب الموقع الحي للباصات
//   getLiveLocations(): Observable<BusLocation[]> {
//     return this.http.get<BusLocation[]>(`${this.apiUrl}/Driver/buses`);
//   }

//   // جلب حالة الرحلة للباص
//   getTripStatus(busId: string): Observable<TripStatus> {
//     return this.http.get<TripStatus>(`${this.apiUrl}/Driver/buses/${busId}/trip-status`);
//   }

//   // بدء رحلة جديدة
//   startTrip(busId: string, startData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Driver/start-trip`, {
//       busId,
//       ...startData
//     });
//   }

//   // تحديث موقع الباص
//   updateBusLocation(busId: string, locationData: {
//     latitude: number;
//     longitude: number;
//     speed?: number;
//     direction?: number;
//   }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Driver/update-location`, {
//       busId,
//       ...locationData
//     });
//   }

//   // إنهاء الرحلة
//   endTrip(busId: string, endData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Driver/end-trip`, {
//       busId,
//       ...endData
//     });
//   }

//   // إبلاغ عن مشكلة
//   reportIssue(busId: string, issueData: {
//     issueType: string;
//     description: string;
//     severity: 'low' | 'medium' | 'high';
//   }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Driver/report-issue`, {
//       busId,
//       ...issueData
//     });
//   }

//   // تسجيل محطة
//   recordStation(busId: string, stationData: {
//     stationId: string;
//     stationName: string;
//     timestamp: Date;
//   }): Observable<any> {
//     return this.http.post(`${this.apiUrl}/Driver/record-station`, {
//       busId,
//       ...stationData
//     });
//   }
// }
// src/app/service/tracker.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../environments/environment';
import { Bus, BusLocation, TripStatus } from './bus.model';
import { MOCK_BUSES } from '../app/mock-data/mock-tracker';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAllBuses(): Observable<Bus[]> {
    return of(MOCK_BUSES);
  }

  getBusById(busId: string): Observable<Bus> {
    const bus = MOCK_BUSES.find(b => b.id === busId);
    return of(bus!);
  }

  getLiveLocations(): Observable<BusLocation[]> {
    const locations: BusLocation[] = MOCK_BUSES
      .filter(bus => bus.status === 'active')
      .map(bus => ({
        busId: bus.id,
        latitude: bus.currentLatitude!,
        longitude: bus.currentLongitude!,
        timestamp: new Date()
      }));
    return of(locations);
  }

  // باقي الوظائف كما هي بدون تعديل
}
