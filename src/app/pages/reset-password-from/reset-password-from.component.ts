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
  reponseMessage:any;
  errorMessage = '';
  hidePassword = true;

  constructor(private userService: UserService, private snackbarService: SnackbarService) {}

  changePasswordForm = new FormGroup({
    current_password: new FormControl("",[Validators.required]),
    new_password: new FormControl("",[Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$')]),
    confirm_password: new FormControl("",[Validators.required]),
  });

  handlePasswordChange() {
    this.userService.changePussword(this.changePasswordForm.value).subscribe({
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
    const new_password = this.changePasswordForm.get('new_password')!.value;
    const confirm_password = this.changePasswordForm.get('confirm_password')!.value;
    return new_password === confirm_password;
  }
}
