import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ChatService } from '../../services/chat/chat.service';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { User } from '../../models/user';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, MatSidenavModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  user:any = null;
  errorMessage = '';
  messageForm:any = FormGroup;
  chats:any = [];
  messages:any = [];

  chatName = '';
  receiverId!:number;

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  constructor(
    private router: Router, 
    private chatService:ChatService,
    private authService:AuthServiceService,
    public snackbarService:SnackbarService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.chatService.setChatComponent(this);
      this.getCurrentUserDataAndConnect();
      this.getAllUserChats();
      this.messageForm = new FormGroup({
        message: new FormControl("",[Validators.required, Validators.maxLength(500)])
      });
    } else {
      this.router.navigate(['/auth']);
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  setUpChat(newChat:string, newReceiverId:number, chatId:number) {
    this.chatName = newChat;
    this.receiverId = newReceiverId;
    this.chatService.setChatId(chatId);
    this.getChatMessages();
  }

  getChatMessages() {
    this.chatService.reciveChatMessages().subscribe({
      next: data => {
        this.messages = data;
        this.scrollToBottom();
      }
    });
  }

  handleSendMessage() {
    this.chatService.sendMessage(this.user.id, this.receiverId, this.messageForm.value.message);
    const message = {
      senderId: this.user.id,
      nickname: this.user.nickname,
      photo: this.user.photo,
      content: this.messageForm.value.message,
      timestamp: new Date()
    }
    this.messages.push(message);
    this.messageForm.reset();
    this.messageForm.controls.message.setErrors(null);
    this.scrollToBottom();
  }

  getCurrentUserDataAndConnect() {
    this.user = this.authService.getUserProfile().subscribe({
      next: (response: SuccessResponse<User>) => {
        this.user = response.data;
        this.chatService.connect(this.user.nickname);
      },
      error: (error: ErrorResponse) => {
      if (error.error.error.message) {
          this.errorMessage = error.error.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  getAllUserChats() {
    this.chatService.getUserChats().subscribe({
      next: data => {
        this.chats = data;
      },
      error: (error: any) => {
      if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  trackById(index: number, object: any): number {
    return object.id;
  }

  isChatSelected():boolean {
    return this.chatName === '';
  }

  getButtonColor(buttonText:string):string {
    if (buttonText === this.chatName) {
      return '[#3F51B5]';
    }
    return 'transparent';
  }

  getButtonTextColor(buttonText:string):string {
    if (buttonText === this.chatName) {
      return 'white';
    }
    return 'black';
  }

  formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    
    return formattedDate;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
          this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch(err) { 
          console.log(err);
      }
    });
  }
}
