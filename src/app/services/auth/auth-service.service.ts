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

  // login(userData:any):Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/api/v1/auth/authenticate`, userData)
  // }

  // register(userData:any):Observable<any> {
  //   return this.http.post<any>(`${this.baseUrl}/api/v1/auth/register`, userData)
  // }

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

  getUserProfile():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("jwt")}`
    })
    return this.http.post<any>(`${this.baseUrl}/api/v1/auth/register`, {headers}).pipe(
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
