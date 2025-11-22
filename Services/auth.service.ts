// // import { HttpClient } from "@angular/common/http";
// // import { Injectable } from "@angular/core";
// // import { Observable, tap } from 'rxjs';
// // import { environment } from '../src/environments/environment';

// // interface LoginRequest {
// //   email: string;
// //   password: string;
// // }

// // interface RegisterRequest {
// //   name: string;
// //   email: string;
// //   password: string;
// //   phone?: string;
// //   role: string;
// // }

// // interface AuthResponse {
// //   success: boolean;
// //   token?: string;
// //   user?: {
// //     id: string;
// //     name: string;
// //     email: string;
// //     role: string;
// //   };
// //   message?: string;
// // }

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class AuthServices {
// //   // private apiBaseUrl = environment.apiBaseUrl || 'https://localhost:7114';
// // private apiBaseUrl = `${environment.apiBaseUrl}`;

// //   constructor(private _HttpClient: HttpClient) {}

// //   serLogIn(payload: LoginRequest): Observable<AuthResponse> {
// //     return this._HttpClient.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload)
// //       .pipe(
// //         tap(response => {
// //           if (response.success && response.token) {
// //             localStorage.setItem('token', response.token);
// //             localStorage.setItem('user', JSON.stringify(response.user));
// //           }
// //         })
// //       );
// //   }

// //   serSignUp(payload: RegisterRequest): Observable<AuthResponse> {
// //     return this._HttpClient.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload)
// //       .pipe(
// //         tap(response => {
// //           if (response.success && response.token) {
// //             localStorage.setItem('token', response.token);
// //             localStorage.setItem('user', JSON.stringify(response.user));
// //           }
// //         })
// //       );
// //   }

// //   getToken(): string | null {
// //     return localStorage.getItem('token');
// //   }

// //   getUser(): { id: string; name: string; email: string; role: string } | null {
// //     const userStr = localStorage.getItem('user');
// //     return userStr ? JSON.parse(userStr) : null;
// //   }

// //   logout(): void {
// //     localStorage.removeItem('token');
// //     localStorage.removeItem('user');
// //   }

// //   isAuthenticated(): boolean {
// //     return !!this.getToken();
// الكود الاصلي القديم  end
// import { HttpClient } from "@angular/common/http";
// import { Injectable } from "@angular/core";
// import { Observable, tap } from 'rxjs';
// import { environment } from '../src/environments/environment';

// interface LoginRequest {
//   email: string;
//   password: string;
// }

// interface RegisterRequest {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   role: string;
// }

// interface AuthResponse {
//   success: boolean;
//   token?: string;
//   user?: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//   };
//   message?: string;
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthServices {
//   private apiBaseUrl = `${environment.apiBaseUrl}`;

//   constructor(private http: HttpClient) {} //

//   // =================== الباك-end login/signup ===================
//   serLogIn(payload: LoginRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload)
//       .pipe(
//         tap((response: AuthResponse) => {
//           if (response.success && response.token && response.user) {
//             localStorage.setItem('token', response.token);
//             localStorage.setItem('user', JSON.stringify(response.user));
//           }
//         })
//       );
//   }

//   serSignUp(payload: RegisterRequest): Observable<AuthResponse> {
//     return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload)
//       .pipe(
//         tap((response: AuthResponse) => {
//           if (response.success && response.token && response.user) {
//             localStorage.setItem('token', response.token);
//             localStorage.setItem('user', JSON.stringify(response.user));
//           }
//         })
//       );
//   }

//   // =================== دوال المظهر و Navbar ===================
//   getToken(): string | null {
//     return localStorage.getItem('token');
//   }

//   getUser(): { id: string; name: string; email: string; role: string } | null {
//     const userStr = localStorage.getItem('user');
//     return userStr ? JSON.parse(userStr) : null;
//   }

//   getRole(): string | null {
//     const user = this.getUser();
//     return user ? user.role : null;
//   }

//   isLoggedIn(): boolean {
//     return !!this.getToken();
//   }

//   logout(): void {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//   }
// }
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from '../src/environments/environment';

interface LoginRequest { email: string; password: string; }
interface RegisterRequest { name: string; email: string; password: string; phone?: string; role: string; }
interface AuthResponse { success: boolean; token?: string; user?: { id: string; name: string; email: string; role: string }; message?: string }

@Injectable({ providedIn: 'root' })
export class AuthServices {

  private apiBaseUrl = `${environment.apiBaseUrl}`;

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = this.getUser();
    if (savedUser) this.userSubject.next(savedUser);
  }

  serLogIn(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, payload)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.success && res.token && res.user) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userSubject.next(res.user);
          }
        })
      );
  }

  serSignUp(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, payload)
      .pipe(
        tap((res: AuthResponse) => {
          if (res.success && res.token && res.user) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            this.userSubject.next(res.user);
          }
        })
      );
  }

  getToken(): string | null { return localStorage.getItem('token'); }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
}
