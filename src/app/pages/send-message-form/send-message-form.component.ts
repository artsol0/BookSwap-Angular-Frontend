import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from '../../services/chat/chat.service';

@Component({
  selector: 'app-send-message-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './send-message-form.component.html',
  styleUrl: './send-message-form.component.scss'
})
export class SendMessageFormComponent implements OnInit {

  messageForm:any = FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData:any, 
    private chatService:ChatService,
    private formBuilder: FormBuilder,
    public snackbarService: SnackbarService,
    public dialogRef: MatDialogRef<SendMessageFormComponent>
  ) {}

  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      message: new FormControl("", [Validators.required, Validators.maxLength(500)])
    });
  }

  hadnleMessageSending() {
    this.chatService.sendGreetingMessage(this.dialogData.userId, this.dialogData.receiverId, this.messageForm.value.message).subscribe({
      next: (response: any) => {
        this.snackbarService.openSnackBar(response.data, "");
      },
      error: (error: any) => {
        this.snackbarService.openSnackBar("Unexpected error occurred", "error");
      }
    });
  }
}
