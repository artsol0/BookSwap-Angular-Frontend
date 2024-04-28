import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  getAllBooks(page:number, keyword:string) :Observable<any> {
    return this.http.get<any>(this.baseUrl + "/api/v1/book/get/all?page=" + page + "&keyword=" + keyword);
  }

  getAllBooksByAttributes(page:number, attributesData:any) :Observable<any> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.post<any>(this.baseUrl + "/api/v1/book/get/by/attributes?page=" + page, attributesData);
  }

  getBookAdditionalInfo(id:number) :Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(this.baseUrl + "/api/v1/book/get/" + id + "/additional-info", {headers});
  }

  getBookNotes(id:number) :Observable<any> {
    return this.http.get<any>(this.baseUrl + "/api/v1/notes/get/" + id);
  }
}
