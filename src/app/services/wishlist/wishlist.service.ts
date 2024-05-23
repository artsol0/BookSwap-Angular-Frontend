import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Book } from '../../models/book';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getWishlistBooks():Observable<SuccessResponse<Book[]>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<SuccessResponse<Book[]>>(this.baseUrl + "/api/v1/wishlist/get-books", {headers});
  }

  addBookToWishlist(id:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post<MessageResponse>(this.baseUrl + "/api/v1/wishlist/add-book/" + id, null, {headers});
  }

  removeBookFromWishlist(id:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete<MessageResponse>(this.baseUrl + "/api/v1/wishlist/remove-book/" + id, {headers});
  }
}
