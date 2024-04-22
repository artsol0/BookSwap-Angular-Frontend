import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  addReview(bookId:number, reviewData:any) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.post(this.baseUrl + "/api/v1/review/" + bookId + "/add-review", reviewData, {headers});
  }

  deleteReview(bookId:number, userId:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.delete(this.baseUrl + "/api/v1/review/delete/" + userId + "/" + bookId, {headers})
  }

  getBookReviews(bookId:number, page:number):Observable<any> {
    return this.http.get<any>(this.baseUrl + "/api/v1/review/" + bookId + "/get-reviews-page?page=" + page);
  }

  getReviewExistence(bookId:number, userId:number) {
    return this.http.get<any>(this.baseUrl + "/api/v1/review/exist/" + userId + "/" + bookId);
  }
}
