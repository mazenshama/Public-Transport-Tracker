import { AuthServices } from './../../../../../Services/auth.service';
import { Component } from '@angular/core';
import {FormControl,FormGroup,ReactiveFormsModule, Validators } from '@angular/forms'
import { NgIf } from '@angular/common' 
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // constructor( private _AuthService:AuthService, private _Router:Router){}
      constructor( private _Router:Router){}
    isLoginMode = true;

  
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)])
  })

   toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  logIn(){
    console.log(this.loginForm.value)
    // if(this.loginForm.valid){
    //    this._AuthServices.serLogIn(this.loginForm.value).subscribe({
    //   next:(res)=>{
    //         console.log(res);

    //   }
    // })
    // }
  }
}