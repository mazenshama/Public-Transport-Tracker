
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { LucideAngularModule } from 'lucide-angular';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, LucideAngularModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent {
//   currentPage = 'home';
//   isLoggedIn = false;

//   // pages = [
//   //   { id: 'home', name: 'Home', icon: 'home' },
//   //   { id: 'live', name: 'Live Tracker', icon: 'navigation' },
//   //   { id: 'routes', name: 'Routes', icon: 'route' },
//   //   { id: 'contact', name: 'Contact', icon: 'phone' }
//   // ];
// pages = [
//   { id: '', name: 'Home', icon: 'home' },
//   { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
//   { id: 'routes', name: 'Routes', icon: 'route' },
//   { id: 'contact', name: 'Contact', icon: 'phone' }
// ];

//   constructor(private router: Router) {}

//   navigate(page: string) {
//     this.currentPage = page;
//     this.router.navigate(['/' + page]);
//   }

//   signIn() {
//     this.isLoggedIn = true;
//   }

//   signOut() {
//     this.isLoggedIn = false;
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  currentPage = ''; 
  isLoggedIn = false;

  pages = [
    { id: '', name: 'Home', icon: 'home' },
    { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
    { id: 'routes', name: 'Routes', icon: 'route' },
    { id: 'contact', name: 'Contact', icon: 'phone' }
  ];

  constructor(private router: Router) {
    const currentUrl = this.router.url.replace('/', '');
    this.currentPage = currentUrl || '';
  }

  navigate(page: string) {
    this.currentPage = page;
    this.router.navigate(['/' + page]);
  }

  signIn() {
    this.isLoggedIn = true;
  }

  signOut() {
    this.isLoggedIn = false;
  }
}
