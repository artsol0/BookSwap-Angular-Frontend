import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookAttributesService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getGenres():Observable<any>  {
    return this.http.get(this.baseUrl + "/api/v1/genre/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getLanguages():Observable<any>  {
    return this.http.get(this.baseUrl + "/api/v1/language/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getQualities():Observable<any>  {
    return this.http.get(this.baseUrl + "/api/v1/quality/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getStatuses():Observable<any>  {
    return this.http.get(this.baseUrl + "/api/v1/status/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }
}
