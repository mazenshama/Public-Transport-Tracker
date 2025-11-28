// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { RouteModel } from './api.service-admin';
// import { environment } from '../environments/environment';
// import { firstValueFrom } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoutesService {

//   private apiUrl = `${environment.apiBaseUrl}/Admin/routes`;

//   constructor(private http: HttpClient) {}

// getRoutes(): Promise<RouteModel[]> {
//   const token = localStorage.getItem('token');

//   return firstValueFrom(
//     this.http.get<any>(this.apiUrl, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     })
//   ).then(res => {
//     console.log("ROUTES API RESPONSE:", res);
//     return res.data || res.routes || res.items || res;
//   });
// }

//   createRoute(payload: Partial<RouteModel>): Promise<any> {
//     return firstValueFrom(
//       this.http.post(this.apiUrl, payload)
//     );
//   }
//   deleteRoute(routeId: string): Promise<any> {
//     return firstValueFrom(
//       this.http.delete(`${this.apiUrl}/${routeId}`)
//     );
//   }
// }
import { Injectable } from '@angular/core';
import { RouteModel } from './api.service-admin';
import { MOCK_ROUTES } from '../app/mock-data/mock-routes';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor() {}

  // بدل getRoutes من API، نرجع Mock Data
  getRoutes(): Promise<RouteModel[]> {
    return Promise.resolve(MOCK_ROUTES);
  }

  // هذه الدوال ممكن تظل موجودة إذا حابب تحافظ على الـ API لاحقًا
  createRoute(payload: Partial<RouteModel>): Promise<any> {
    console.log('Creating route (mock):', payload);
    return Promise.resolve({ success: true });
  }

  deleteRoute(routeId: string): Promise<any> {
    console.log('Deleting route (mock):', routeId);
    return Promise.resolve({ success: true });
  }
}
