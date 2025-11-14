import { AuthServices } from './../../../../../Services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(
    private _AuthServices: AuthServices,
    private _Router: Router
  ) {}

  isLoginMode = true;
  errorMessage: string = '';
  isLoading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)])
  });

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  logIn() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this._AuthServices.serLogIn(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.success && res.user) {
            // Navigate based on role
            const role = res.user.role.toLowerCase();
            if (role === 'admin') {
              this._Router.navigate(['/admin']);
            } else if (role === 'driver') {
              this._Router.navigate(['/driver']);
            } else {
              this._Router.navigate(['/home']);
            }
          } else {
            this.errorMessage = res.message || 'Login failed';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'An error occurred during login';
          console.error('Login error:', err);
        }
      });
    }
  }
}