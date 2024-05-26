import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { ChatComponent } from '../../pages/chat/chat.component';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Chat } from '../../models/chat/chat';
import { Message } from '../../models/chat/message';

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
    this.nickname = nickname;
    this.socket = new SockJS(this.baseUrl + "/ws");
    this.stompClient = Stomp.over(this.socket);
    const that = this;
    this.stompClient.connect({Authorization: `Bearer ${localStorage.getItem("token")}`}, function(frame) {
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
    this.stompClient?.disconnect(this.onDisconnect, {Authorization: `Bearer ${localStorage.getItem("token")}`});
  }

  onDisconnect() {
    console.log("disconnected");
  }

  getUserChats():Observable<SuccessResponse<Chat[]>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<SuccessResponse<Chat[]>>(this.baseUrl + "/get/chats", {headers});
  }

  reciveChatMessages():Observable<SuccessResponse<Message[]>> {
    const headers = new HttpHeaders({
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    return this.http.get<SuccessResponse<Message[]>>(this.baseUrl + "/messages/" + this.chatId, {headers});
  }

  sendMessage(receiverId:number, content:string) {
    this.stompClient?.send(
      '/app/chat',
      { Authorization: `Bearer ${localStorage.getItem("token")}` },
      JSON.stringify({
        content: content,
        timestamp: new Date(),
        receiver_id: receiverId
      })
    );
  }

  sendGreetingMessage(receiverId:number, content:string):Observable<SuccessResponse<string>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization:`Bearer ${localStorage.getItem("token")}`
    });
    const message = JSON.stringify({
      content: content,
      timestamp: new Date(),
      receiver_id: receiverId
    });
    return this.http.post<SuccessResponse<string>>(this.baseUrl + "/add/message", message, {headers});
  }

}
