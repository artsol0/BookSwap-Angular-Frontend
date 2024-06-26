import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-reset-password-from',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './reset-password-from.component.html',
  styleUrl: './reset-password-from.component.scss'
})
export class ResetPasswordFromComponent {
  responseMessage:string = '';
  hidePassword = true;

  constructor(private userService: UserService, private snackbarService: SnackbarService) {}

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl("",[Validators.required]),
    newPassword: new FormControl("",[Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$')]),
    confirmPassword: new FormControl("",[Validators.required]),
  });

  handlePasswordChange() {
    this.userService.changePussword(this.changePasswordForm.value).subscribe({
      next: (response: any) => {
        this.responseMessage = response?.message;
        this.snackbarService.openSnackBar(this.responseMessage, "");
      },
      error: (error: any) => {
        if (error.error?.error.message) {
          this.responseMessage = error.error?.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
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

  passwordsAreMatch():boolean {
    const newPassword = this.changePasswordForm.get('newPassword')!.value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword')!.value;
    return newPassword === confirmPassword;
  }
}
