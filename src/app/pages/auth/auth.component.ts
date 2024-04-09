import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { ForgotPasswordFormComponent } from '../forgot-password-form/forgot-password-form.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isRegister = true;
  hidePassword = true;
  reponseMessage:any;
  errorMessage = '';

  constructor(public authService:AuthServiceService, public snackbarService:SnackbarService, public dialog: MatDialog) {
  }

  registrationForm = new FormGroup({
    nickname: new FormControl("",[Validators.required, Validators.pattern('^[a-zA-Z0-9_]+$')]),
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",[Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$')])
  })

  loginForm = new FormGroup({
    email: new FormControl("",[Validators.required, Validators.email]),
    password: new FormControl("",[Validators.required])
  })

  handleRegister() {
    console.log("register ", this.registrationForm.value);
    if (this.registrationForm.valid && this.registrationForm.dirty) {
      this.authService.register(this.registrationForm.value).subscribe({
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

  handleLogin() {
    console.log("login ", this.loginForm.value);
    if (this.loginForm.valid && this.loginForm.dirty) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.data.token);
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

  handleOpenForgotPasswordForm() {
    this.dialog.open(ForgotPasswordFormComponent)
  }

  togglePannel() {
      this.isRegister = !this.isRegister;
  }

  passwordErrorMessage(userPassword:any):string {
    if (!userPassword.match('(?=.*[A-Z])')) {
      return "Password must contain at least one uppercase letter";
    } else if (!userPassword.match('(?=.*[a-z])')) {
      return "Password must contain at least one lowercase letter";
    } else if (!userPassword.match('(.*[0-9].*)')) {
      return "Password must contain at least one digit";
    } else if (!userPassword.match('(?=.*[!@#$%^&*])')) {
      return "Password must contain at least one special character";
    }
    return "";
  }
}
