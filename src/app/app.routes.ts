import { Routes } from '@angular/router';

import { HomeComponent } from './components/user/home/home.component';
import { LiveTrackerComponent } from './components/user/live-tracker/live-tracker.component';
import { RoutingComponent } from './components/user/routing/routing.component';
import { ContactComponent } from './components/user/contact/contact.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { DriverDashboardComponent } from './components/driver/driver-dashboard/driver-dashboard.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';

export const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},

  {path:'login',component:LoginComponent, title: 'login' },
  {path:'register',component:RegisterComponent, title: 'register'},
  
  { path: 'home', component: HomeComponent, title: 'Home' },
  { path: 'live-tracker', component: LiveTrackerComponent, title: 'Live Tracker' },
  { path: 'routes', component: RoutingComponent, title: 'Routes' },
  { path: 'contact', component: ContactComponent, title: 'Contact Us' },
  { path: 'admin', component: AdminDashboardComponent, title: 'Admin Dashboard' },
  { path: 'driver', component: DriverDashboardComponent, title: 'Driver Dashboard' },


  { path: '**', redirectTo: '', pathMatch: 'full' }
];
