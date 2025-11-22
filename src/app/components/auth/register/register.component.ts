import { AuthServices } from '../../../../../Services/auth.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  isconPasswordValid: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private _AuthServices: AuthServices,
    private _Router: Router
  ) {}

  regForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
    role: new FormControl('', [Validators.required])
  });

  SignUp() {
    if (this.regForm.valid) {
      // Check password match
      if (this.regForm.value.password !== this.regForm.value.confirmPassword) {
        this.errorMessage = 'Passwords do not match';
        return;
      }

      this.isLoading = true;
      this.errorMessage = '';

      const payload = {
        name: this.regForm.value.name,
        email: this.regForm.value.email,
        password: this.regForm.value.password,
        phone: '',
        role: this.regForm.value.role
      };

      this._AuthServices.serSignUp(payload).subscribe({
        next: (res) => {
          console.log(res);
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
            this.errorMessage = res.message || 'Registration failed';
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'An error occurred during registration';
          console.error('Registration error:', err);
        }
      });
    }
  }

  matchPassword() {
    if (this.regForm.value.password == this.regForm.value.confirmPassword) {
      this.isconPasswordValid = true;
    } else {
      this.isconPasswordValid = false;
    }
  }
}
