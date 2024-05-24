import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Review } from '../../models/review';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { Page } from '../../models/pageable/page';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  addReview(bookId:number, reviewData:any):Observable<SuccessResponse<Review>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.post<SuccessResponse<Review>>(this.baseUrl + "/api/v1/review/" + bookId + "/add-review", reviewData, {headers});
  }

  deleteReview(bookId:number, userId:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.delete<MessageResponse>(this.baseUrl + "/api/v1/review/delete/" + userId + "/" + bookId, {headers})
  }

  getBookReviews(bookId:number, page:number):Observable<SuccessResponse<Page<Review>>> {
    return this.http.get<SuccessResponse<Page<Review>>>(this.baseUrl + "/api/v1/review/" + bookId + "/get-reviews-page?page=" + page);
  }

  getReviewExistence(bookId:number, userId:number):Observable<SuccessResponse<boolean>> {
    return this.http.get<SuccessResponse<boolean>>(this.baseUrl + "/api/v1/review/exist/" + userId + "/" + bookId);
  }
}
