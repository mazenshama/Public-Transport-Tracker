import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from 'rxjs';
import { environment } from '../src/environments/environment';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private apiBaseUrl = environment.apiBaseUrl || 'https://localhost:7000'; 

  constructor(private _HttpClient: HttpClient) {}

  serLogIn(payload: LoginRequest): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${this.apiBaseUrl}/api/auth/login`, payload)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }

  serSignUp(payload: RegisterRequest): Observable<AuthResponse> {
    return this._HttpClient.post<AuthResponse>(`${this.apiBaseUrl}/api/auth/register`, payload)
      .pipe(
        tap(response => {
          if (response.success && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): { id: string; name: string; email: string; role: string } | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
