import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { User } from '../../models/user';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { Country } from '../../models/location/country';
import { City } from '../../models/location/city';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getCurrentUserId():Observable<SuccessResponse<number>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<SuccessResponse<number>>(this.baseUrl + "/api/v1/user/get/current-id", {headers});
  }

  getUserDataById(id:number):Observable<SuccessResponse<User>> {
    return this.http.get<SuccessResponse<User>>(this.baseUrl + "/api/v1/user/get/" + id);
  }

  changePussword(passwordData:any):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post<MessageResponse>(this.baseUrl + "/api/v1/user/change-password", passwordData, {headers});
  }

  updateLocation(locationData:any):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/user/change-location", locationData, {headers});
  }

  getAllCountries():Observable<SuccessResponse<Country[]>> {
    return this.http.get<SuccessResponse<Country[]>>(this.baseUrl + "/api/v1/location/get/countries");
  }

  getCitiesByCountry(iso2:string):Observable<SuccessResponse<City[]>> {
    return this.http.get<SuccessResponse<City[]>>(this.baseUrl + "/api/v1/location/get/countries/" + iso2 + "/cities");
  }

  updatePhoto(formData: FormData):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/user/change-photo", formData, {headers});
  }

  changeAcitvity(id:number):Observable<MessageResponse> {
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/user/change-location" + id, {
      headers:new HttpHeaders().set('Content-Type','application/json')
    })
  }
}
