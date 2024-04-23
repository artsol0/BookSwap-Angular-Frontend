import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getBook(id:number) :Observable<any> {
    return this.http.get<any>(this.baseUrl + "/api/v1/book/get/" + id);
  }

  getBookNotes(id:number) :Observable<any> {
    return this.http.get<any>(this.baseUrl + "/api/v1/notes/get/" + id);
  }
}
