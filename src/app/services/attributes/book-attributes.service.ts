import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Genre } from '../../models/attributes/genre';
import { Language } from '../../models/attributes/language';
import { Quality } from '../../models/attributes/quality';
import { Status } from '../../models/attributes/status';

@Injectable({
  providedIn: 'root'
})
export class BookAttributesService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getGenres():Observable<SuccessResponse<Genre[]>>  {
    return this.http.get<SuccessResponse<Genre[]>>(this.baseUrl + "/api/v1/genre/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getLanguages():Observable<SuccessResponse<Language[]>>  {
    return this.http.get<SuccessResponse<Language[]>>(this.baseUrl + "/api/v1/language/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getQualities():Observable<SuccessResponse<Quality[]>>  {
    return this.http.get<SuccessResponse<Quality[]>> (this.baseUrl + "/api/v1/quality/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }

  getStatuses():Observable<SuccessResponse<Status[]>>  {
    return this.http.get<SuccessResponse<Status[]>>(this.baseUrl + "/api/v1/status/get/all", {
      headers:new HttpHeaders().set('Content-Type','application/json')
    });
  }
}
