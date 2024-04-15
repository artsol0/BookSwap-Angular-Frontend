import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getLibraryBooks():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(`${this.baseUrl}/api/v1/library/get-books`, {headers});
  }

  addNewBook(formData: FormData) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.post(this.baseUrl + "/api/v1/book/add", formData, {headers});
  }

  deleteBook(id:any) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete(this.baseUrl + "/api/v1/book/delete/" + id, {headers});
  }
}
