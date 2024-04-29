import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getCurrentUserId() {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<any>(this.baseUrl + "/api/v1/user/get/current-id", {headers});
  }

  getUserDataById(id:number) {
    return this.http.get<any>(this.baseUrl + "/api/v1/user/get/" + id);
  }

  changePussword(passwordData:any) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post(this.baseUrl + "/api/v1/user/change-password", passwordData, {headers});
  }

  updateLocation(locationData:any) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.put(this.baseUrl + "/api/v1/user/change-location", locationData, {headers});
  }

  updatePhoto(formData: FormData) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.put(this.baseUrl + "/api/v1/user/change-photo", formData, {headers});
  }

  changeAcitvity(id:number) {
    return this.http.put(this.baseUrl + "/api/v1/user/change-location" + id, {
      headers:new HttpHeaders().set('Content-Type','application/json')
    })
  }
}
