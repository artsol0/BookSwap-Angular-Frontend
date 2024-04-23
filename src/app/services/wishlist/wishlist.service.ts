import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  getWishlistBooks():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(this.baseUrl + "/api/v1/wishlist/get-books", {headers});
  }

  addBookToWishlist(id:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post(this.baseUrl + "/api/v1/wishlist/add-book/" + id, null, {headers});
  }

  removeBookFromWishlist(id:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete(this.baseUrl + "/api/v1/wishlist/remove-book/" + id, {headers});
  }
}
