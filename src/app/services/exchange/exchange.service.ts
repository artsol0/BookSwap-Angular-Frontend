import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Exchange } from '../../models/exchange';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  createNewExchange(bookId:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post<MessageResponse>(this.baseUrl + "/api/v1/exchange/create/" + bookId, null, {headers});
  }

  getAllInitiateExchanges():Observable<SuccessResponse<Exchange[]>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<SuccessResponse<Exchange[]>>(this.baseUrl + "/api/v1/exchange/get/initiation", {headers});
  }

  getAllRecipientExchanges():Observable<SuccessResponse<Exchange[]>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<SuccessResponse<Exchange[]>>(this.baseUrl + "/api/v1/exchange/get/recipient", {headers});
  }

  confirmExchange(exchangeId:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.put<MessageResponse>(this.baseUrl + "/api/v1/exchange/confirm/" + exchangeId, null, {headers});
  }

  deleteExchange(exchangeId:number):Observable<MessageResponse> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete<MessageResponse>(this.baseUrl + "/api/v1/exchange/delete/" + exchangeId, {headers})
  }
}
