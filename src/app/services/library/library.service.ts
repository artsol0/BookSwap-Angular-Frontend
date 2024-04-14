import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  librarySubject = new BehaviorSubject<any>({
    books:[],
    loading:false,
    newBook:null
  });

  getLibraryBooks():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(`${this.baseUrl}/api/v1/library/get-books`, {headers}).pipe(
      tap((books)=>{
        const curentState = this.librarySubject.value;
        this.librarySubject.next({...curentState, books});
      })
    );
  }
}
