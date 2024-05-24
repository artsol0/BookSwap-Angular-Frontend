import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Book } from '../../models/book/book';
import { Page } from '../../models/pageable/page';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Note } from '../../models/note';
import { BookAdditionalInfo } from '../../models/book/bookAddtionalInfo';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getBook(id:number):Observable<SuccessResponse<Book>> {
    return this.http.get<SuccessResponse<Book>>(this.baseUrl + "/api/v1/book/get/" + id);
  }

  getAllBooks(page:number, keyword:string):Observable<SuccessResponse<Page<Book>>> {
    return this.http.get<SuccessResponse<Page<Book>>>(this.baseUrl + "/api/v1/book/get/all?page=" + page + "&keyword=" + keyword);
  }

  getAllBooksByAttributes(page:number, attributesData:any):Observable<SuccessResponse<Page<Book>>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.post<SuccessResponse<Page<Book>>>(this.baseUrl + "/api/v1/book/get/by/attributes?page=" + page, attributesData);
  }

  getBookAdditionalInfo(id:number):Observable<SuccessResponse<BookAdditionalInfo>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<SuccessResponse<BookAdditionalInfo>>(this.baseUrl + "/api/v1/book/get/" + id + "/additional-info", {headers});
  }

  getBookNotes(id:number):Observable<SuccessResponse<Note[]>> {
    return this.http.get<SuccessResponse<Note[]>>(this.baseUrl + "/api/v1/notes/get/" + id);
  }
}
