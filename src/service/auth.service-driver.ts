import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  name: string;
  email?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private currentUser = signal<User | null>(null);

  constructor() {
    // Initialize with mock user for demo
    const mockUser: User = {
      id: 'driver-001',
      name: 'John Driver',
    };
    this.setUser(mockUser);
  }

  setUser(user: User | null): void {
    this.currentUser.set(user);
    this.userSubject.next(user);
  }

  getUser(): User | null {
    return this.currentUser();
  }

  getUserSignal() {
    return this.currentUser.asReadonly();
  }

  logout(): void {
    this.setUser(null);
  }
}
