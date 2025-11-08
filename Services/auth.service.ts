import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

interface User{
  name:string,
  email:string,
  password:string,
  repassword:string,
  phone:number
}

@Injectable({
  providedIn:'root'
})

export class AuthServices{
  
  constructor (private _HttpClient:HttpClient){}
  
  //  serLogIn(payload:User):Observable<any>{
  //   //Ha7ot el API
  //    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/auth/login`, payload)
  //  }

    serLogIn(payload:User):Observable<any>{
    //Ha7ot el API
     return this._HttpClient.post(``, payload)
   }

   serSignUp(payload:User):Observable<any>{
    //Ha7ot el API
     return this._HttpClient.post(``, payload)
   }


  }