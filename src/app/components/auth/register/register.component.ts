import { AuthServices } from './../../../../../Services/auth.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup,Validators,FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  //  constructor( private _AuthServices:AuthServices){}
regForm: FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
    confirmPassword: new FormControl('',[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)]),
    role: new FormControl('',[Validators.required])
  })

  SignUp(){
    // if(this.regForm.valid){
    //    this._AuthServices.serLogIn(this.regForm.value).subscribe({
    //   next:(res)=>{
    //         console.log(res);

    //   }
    // })
    // }
  }
}
