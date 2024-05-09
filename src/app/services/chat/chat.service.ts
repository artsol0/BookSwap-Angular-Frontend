import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatComponent } from '../../pages/chat/chat.component';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket?: WebSocket;
  private stompClient?: Stomp.Client;
  private baseUrl = 'http://localhost:8080';
  
  private nickname = '';
  private chatId?:number;
  private chatComponent?:ChatComponent;

  constructor(private http:HttpClient) { }

  setChatComponent(component:ChatComponent) {
    this.chatComponent = component;
  }

  setChatId(chatId:number) {
    this.chatId = chatId;
  }

  connect(nickname:string) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    this.nickname = nickname;
    this.socket = new SockJS(this.baseUrl + "/ws");
    this.stompClient = Stomp.over(this.socket);
    const that = this;
    this.stompClient.connect({headers}, function(frame) {
      that.stompClient?.subscribe(`/user/${that.nickname}/queue/messages`, (message) => {
        console.log("message recived")
        if (message.body) {
          const parsedMessage = JSON.parse(message.body);
          if (parsedMessage.chatId === that.chatId) {
            that.chatComponent?.messages.push(parsedMessage);
            that.chatComponent?.scrollToBottom();
          }
        }
      });
    }, function(error) {
      that.chatComponent?.snackbarService.openSnackBar("Error occurred while connecting to the server", "error")
    });
  }

  disconnect() {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    this.stompClient?.disconnect(this.onDisconnect, {headers});
  }

  onDisconnect() {
    console.log("disconnected");
  }

  getUserChats():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(this.baseUrl + "/get/chats", {headers});
  }

  reciveChatMessages():Observable<any> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<any>(this.baseUrl + "/messages/" + this.chatId, {headers});
  }

  sendMessage(senderId:number, receiverId:number, content:string) {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    this.stompClient?.send(
      '/app/chat',
      {headers},
      JSON.stringify({
        content: content,
        timestamp: new Date(),
        sender_id: senderId,
        receiver_id: receiverId
      })
    );
  }

  sendGreetingMessage(senderId:number, receiverId:number, content:string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    const message = JSON.stringify({
      content: content,
      timestamp: new Date(),
      sender_id: senderId,
      receiver_id: receiverId
    });
    return this.http.post(this.baseUrl + "/add/message", message, {headers});
  }

}
