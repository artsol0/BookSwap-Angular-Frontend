import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl = 'http://localhost:8080';


  constructor(private http:HttpClient) { }

  authSubject = new BehaviorSubject<any>({
    user:null
  })

  login(userData:any) {
    return this.http.post(this.baseUrl + "/api/v1/auth/authenticate", userData, {
      headers:new HttpHeaders().set('Content-Type','application/json')
    })
  }

  register(userData:any) {
    return this.http.post(this.baseUrl + "/api/v1/auth/register", userData, {
      headers:new HttpHeaders().set('Content-Type','application/json')
    })
  }

  forgotPassword(userData:any) {
    return this.http.post(this.baseUrl + "/api/v1/forgot-password", userData, {
      headers:new HttpHeaders().set('Content-Type','application/json')
    })
  }

  isAuthenticated():boolean {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    } else {
      return true;
    }
  }

  getUserProfile():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    })
    return this.http.get<any>(`${this.baseUrl}/api/v1/user/get/current`, {headers}).pipe(
      tap((user)=>{
        const curentState = this.authSubject.value;
        this.authSubject.next({...curentState, user})
      })
    )
  }

  logout() {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    })
    this.http.post(this.baseUrl + "api/v1/auth/logout", {headers});
    localStorage.clear();
    this.authSubject.next({})
  }
}
