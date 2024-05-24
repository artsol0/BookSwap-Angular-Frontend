import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';

@Component({
  selector: 'app-new-password-form',
  standalone: true,
  imports: [CommonModule, RouterModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.scss'
})
export class NewPasswordFormComponent implements OnInit {

  token:string = '';
  responseMessage:string = '';
  isTokenExpired!:boolean;
  isPasswordChanged:boolean = false;

  constructor(
    private authService:AuthServiceService, 
    private snackbarService:SnackbarService,
    private router: Router, 
    private route: ActivatedRoute) {
  }

  newPasswordForm = new FormGroup({
    newPassword: new FormControl("",[Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$')]),
    confirmPassword: new FormControl("",[Validators.required])
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      (params['token']) ? this.token = params['token'] : this.router.navigate(['/**']);
      if (this.token) {
        this.checkToken();
      }
    });
  }

  checkToken() {
    this.authService.isTokenExpire(this.token).subscribe({
      next: data => {
        this.isTokenExpired = data;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.responseMessage = error.error.error.message;
         } else {
           this.responseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    })
  }

  handlePasswordChange() {
    const requestData = JSON.stringify({
      newPassword: this.newPasswordForm.value.newPassword
    });
    this.authService.resetPassword(requestData, this.token).subscribe({
      next: data => {
        this.isPasswordChanged = data;
        console.log(this.isPasswordChanged);
        if (this.isPasswordChanged) {
          this.snackbarService.openSnackBar("Password  has been changed", "");
          this.router.navigate(['/auth']);
        } else {
          this.snackbarService.openSnackBar("Password has not been changed", "error");
        }
      }
    });
  }

  passwordsAreMatch():boolean {
    const newPassword = this.newPasswordForm.get('newPassword')!.value;
    const confirmPassword = this.newPasswordForm.get('confirmPassword')!.value;
    return newPassword === confirmPassword;
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
