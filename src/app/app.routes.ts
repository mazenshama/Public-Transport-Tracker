import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent),
    title: 'Register'
  },

  {
    path: 'home',
    loadComponent: () => import('./components/user/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'live-tracker',
    loadComponent: () => import('./components/user/live-tracker/live-tracker.component').then(m => m.LiveTrackerComponent),
    title: 'Live Tracker'
  },
  {
    path: 'routes',
    loadComponent: () => import('./components/user/routing/routing.component').then(m => m.RoutingComponent),
    title: 'Routes'
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/user/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contact Us'
  },

  {
    path: 'admin',
    loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard'
  },

  {
    path: 'driver',
    loadComponent: () => import('./components/driver/driver-dashboard/driver-dashboard.component').then(m => m.DriverDashboardComponent),
    title: 'Driver Dashboard'
  },

  { path: '**', redirectTo: '', pathMatch: 'full' }
];
