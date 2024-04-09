import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-forgot-password-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatDialogModule],
  templateUrl: './forgot-password-form.component.html',
  styleUrl: './forgot-password-form.component.scss'
})
export class ForgotPasswordFormComponent {
  reponseMessage:any;
  errorMessage = '';

  constructor(public authService:AuthServiceService, public snackbarService:SnackbarService, public dialog: MatDialog) {
  }

  forgotPasswordForm = new FormGroup({
    email: new FormControl("",[Validators.required, Validators.email])
  })

  handlePasswordForgot() {
    console.log("email ", this.forgotPasswordForm.value);
    if (this.forgotPasswordForm.valid && this.forgotPasswordForm.dirty) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe({
        next: (response: any) => {
          this.reponseMessage = response?.message;
          this.snackbarService.openSnackBar(this.reponseMessage, "");
        },
        error: (error: any) => {
         if (error.error?.error.message) {
            this.reponseMessage = error.error?.error.message;
          } else {
            this.reponseMessage = "Unexpected error occurred";
          }
          this.snackbarService.openSnackBar(this.reponseMessage, "error");
        }
      });
    }
  }
}
