import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { Book } from '../../models/book/book';
import { Page } from '../../models/pageable/page';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { MessageResponse } from '../../models/reponses/MessageResponse';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getLibraryBooks(page:number):Observable<SuccessResponse<Page<Book>>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<SuccessResponse<Page<Book>>>(`${this.baseUrl}/api/v1/book/get/by/user?page=` + page, {headers});
  }

  addNewBook(formData: FormData):Observable<SuccessResponse<Book>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.post<SuccessResponse<Book>>(this.baseUrl + "/api/v1/book/add", formData, {headers});
  }

  updateBook(id:number, formData:FormData):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/book/update/" + id, formData, {headers});
  }

  updateBookPhoto(id:number, formData:FormData):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/book/change-photo/" + id, formData, {headers});
  }

  deleteBook(id:any):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete<MessageResponse>(this.baseUrl + "/api/v1/book/delete/" + id, {headers});
  }
}
