import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http:HttpClient) { }

  createNewExchange(bookId:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.post(this.baseUrl + "/api/v1/exchange/create/" + bookId, null, {headers});
  }

  getAllInitiateExchanges() {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<any>(this.baseUrl + "/api/v1/exchange/get/initiation", {headers});
  }

  getAllRecipientExchanges() {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.get<any>(this.baseUrl + "/api/v1/exchange/get/recipient", {headers});
  }

  confirmExchange(exchangeId:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.put(this.baseUrl + "/api/v1/exchange/confirm/" + exchangeId, null, {headers});
  }

  deleteExchange(exchangeId:number) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }).set('Content-Type','application/json');
    return this.http.delete(this.baseUrl + "/api/v1/exchange/delete/" + exchangeId, {headers})
  }
}
