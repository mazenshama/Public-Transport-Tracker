// // // // import { Component } from '@angular/core';
// // // // import { CommonModule } from '@angular/common';
// // // // import { Router } from '@angular/router';
// // // // import { LucideAngularModule } from 'lucide-angular';

// // // // @Component({
// // // //   selector: 'app-navbar',
// // // //   standalone: true,
// // // //   imports: [CommonModule, LucideAngularModule],
// // // //   templateUrl: './navbar.component.html',
// // // //   styleUrls: ['./navbar.component.css'],
// // // // })
// // // // export class NavbarComponent {
// // // //   currentPage = '';
// // // //   isLoggedIn = false;
// // // //   isMenuOpen = false;

// // // //   pages = [
// // // //     { id: '', name: 'Home', icon: 'home' },
// // // //     { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
// // // //     { id: 'routes', name: 'Routes', icon: 'route' },
// // // //     { id: 'contact', name: 'Contact', icon: 'phone' },
// // // //   ];

// // // //   constructor(private router: Router) {
// // // //     const currentUrl = this.router.url.replace('/', '');
// // // //     this.currentPage = currentUrl || '';
// // // //   }

// // // //   toggleMenu() {
// // // //     this.isMenuOpen = !this.isMenuOpen;
// // // //   }

// // // //   navigate(page: string) {
// // // //     this.currentPage = page;
// // // //     this.router.navigate(['/' + page]);
// // // //     this.isMenuOpen = false;
// // // //   }

// // // //   signIn() {
// // // //       this.router.navigate(['/login']);
// // // //     this.isLoggedIn = true;
// // // //   }

// // // //   signOut() {
// // // //       this.router.navigate(['/']);
// // // //     this.isLoggedIn = false;
// // // //   }
// // // // }
// // // //..........................................
// // // import { Component } from '@angular/core';
// // // import { CommonModule } from '@angular/common';
// // // import { Router } from '@angular/router';
// // // import { LucideAngularModule } from 'lucide-angular';

// // // @Component({
// // //   selector: 'app-navbar',
// // //   standalone: true,
// // //   imports: [CommonModule, LucideAngularModule],
// // //   templateUrl: './navbar.component.html',
// // //   styleUrls: ['./navbar.component.css'],
// // // })
// // // export class NavbarComponent {
// // //   currentPage = '';
// // //   isLoggedIn = false;
// // //   userRole: 'driver' | 'admin' | 'user' | null = null; // نوع المستخدم
// // //   isMenuOpen = false;

// // //   pages = [
// // //     { id: '', name: 'Home', icon: 'home' },
// // //     { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
// // //     { id: 'routes', name: 'Routes', icon: 'route' },
// // //     { id: 'contact', name: 'Contact', icon: 'phone' },
// // //   ];

// // //   constructor(private router: Router) {
// // //     const currentUrl = this.router.url.replace('/', '');
// // //     this.currentPage = currentUrl || '';
// // //   }

// // //   toggleMenu() {
// // //     this.isMenuOpen = !this.isMenuOpen;
// // //   }

// // //   navigate(page: string) {
// // //     this.currentPage = page;
// // //     this.router.navigate(['/' + page]);
// // //     this.isMenuOpen = false;
// // //   }
// // //  openLogin() {
// // //     this.router.navigate(['/login']);
// // //     this.isMenuOpen = false;
// // //   }
// // //   signIn(role: 'driver' | 'admin' | 'user' = 'user') {
// // //     this.isLoggedIn = true;
// // //     this.userRole = role;

// // //     if (role === 'driver') this.router.navigate(['/driver-dashboard']);
// // //     else if (role === 'admin') this.router.navigate(['/admin-dashboard']);
// // //     else this.router.navigate(['/']); // user عادي يروح Home
// // //   }

// // //   signOut() {
// // //     this.isLoggedIn = false;
// // //     this.userRole = null;
// // //     this.router.navigate(['/']);
// // //     this.isMenuOpen = false;
// // //   }
// // // }
// // import { Component } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import { Router } from '@angular/router';
// // import { LucideAngularModule } from 'lucide-angular';
// // import { AuthServices } from '../../../../../Services/auth.service'; 

// // @Component({
// //   selector: 'app-navbar',
// //   standalone: true,
// //   imports: [CommonModule, LucideAngularModule],
// //   templateUrl: './navbar.component.html',
// //   styleUrls: ['./navbar.component.css'],
// // })
// // export class NavbarComponent {
// //   currentPage = '';
// //   isMenuOpen = false;

// //   constructor(private router: Router, public auth: AuthServices) {
// //     const currentUrl = this.router.url.replace('/', '');
// //     this.currentPage = currentUrl || '';
// //   }

// //   pages = [
// //     { id: '', name: 'Home', icon: 'home' },
// //     { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
// //     { id: 'routes', name: 'Routes', icon: 'route' },
// //     { id: 'contact', name: 'Contact', icon: 'phone' },
// //   ];

// //   toggleMenu() {
// //     this.isMenuOpen = !this.isMenuOpen;
// //   }

// //   navigate(page: string) {
// //     this.currentPage = page;
// //     this.router.navigate(['/' + page]);
// //     this.isMenuOpen = false;
// //   }

// //   openLogin() {
// //     this.router.navigate(['/login']);
// //     this.isMenuOpen = false;
// //   }

// //   signOut() {
// //     this.auth.logout();  // استخدام logout من الـ AuthService
// //     this.router.navigate(['/']);
// //     this.isMenuOpen = false;
// //   }
// // }
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { LucideAngularModule } from 'lucide-angular';
// import { AuthServices } from '../../../../../Services/auth.service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, LucideAngularModule],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css'],
// })
// export class NavbarComponent implements OnInit {
//   currentPage = '';
//   isMenuOpen = false;
//   currentUser: {id:string,name:string,email:string,role:string} | null = null;

//   constructor(private router: Router, public auth: AuthServices) {}

//   ngOnInit() {
//     this.currentUser = this.auth.getUser(); // جلب المستخدم عند تحميل الـ component
//     this.auth.user$.subscribe(user => this.currentUser = user); // تحديث مباشر عند تغير الحالة.
//   }
//   pages = [
//     { id: '', name: 'Home', icon: 'home' },
//     { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
//     { id: 'routes', name: 'Routes', icon: 'route' },
//     { id: 'contact', name: 'Contact', icon: 'phone' },
//   ];

//   toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }

//   navigate(page: string) {
//     this.currentPage = page;
//     this.router.navigate(['/' + page]);
//     this.isMenuOpen = false;
//   }

//   openLogin() {
//     this.router.navigate(['/login']);
//     this.isMenuOpen = false;
//   }

//   signOut() {
//     this.auth.logout();
//     this.router.navigate(['/']);
//     this.isMenuOpen = false;
//   }

//   goToDashboard() {
//     if (!this.currentUser) return;
//     const route = this.currentUser.role === 'driver' ? 'driver-dashboard' : 'admin-dashboard';
//     this.navigate(route);
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthServices } from '../../../../../Services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  currentPage = '';
  isMenuOpen = false;
  user$!: Observable<{id:string,name:string,email:string,role:string} | null>;

  pages = [
    { id: '', name: 'Home', icon: 'home' },
    { id: 'live-tracker', name: 'Live Tracker', icon: 'navigation' },
    { id: 'routes', name: 'Routes', icon: 'route' },
    { id: 'contact', name: 'Contact', icon: 'phone' },
  ];

  constructor(private router: Router, public auth: AuthServices) {
    this.user$ = this.auth.user$;
  }

  toggleMenu() { this.isMenuOpen = !this.isMenuOpen; }

  navigate(page: string) {
    this.currentPage = page;
    this.router.navigate(['/' + page]);
    this.isMenuOpen = false;
  }

  openLogin() {
    this.router.navigate(['/login']);
    this.isMenuOpen = false;
  }

  signOut() {
    this.auth.logout();
    this.router.navigate(['/']);
    this.isMenuOpen = false;
  }

  goToDashboard(userRole: string) {
    const route = userRole === 'driver' ? 'driver-dashboard' : 'admin-dashboard';
    this.navigate(route);
  }
}
