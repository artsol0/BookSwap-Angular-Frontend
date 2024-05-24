import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateProfileFormComponent } from '../update-profile-form/update-profile-form.component';
import { ResetPasswordFromComponent } from '../reset-password-from/reset-password-from.component';
import { UserService } from '../../services/user/user.service';
import { SendMessageFormComponent } from '../send-message-form/send-message-form.component';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { User } from '../../models/user';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user!:User;
  reponseMessage:string = '';
  currentUserId!:number;
  isSameUser:boolean = true;

  constructor(
    private userService:UserService,
    private authService:AuthServiceService, 
    private snackbarService:SnackbarService, 
    private dialog: MatDialog, 
    private router: Router, 
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.getUserData(id);
        this.checkIfCurrentUser();
      } else {
        this.getCurrentUserData();
      }
    }
  }

  getUserData(id:number) {
    this.userService.getUserDataById(id).subscribe({
      next: (response: SuccessResponse<User>) => {
        this.user = response.data;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.code === 404) {
          this.router.navigate(['/**'])
        } else {
            if (error.error.error.message) {
              this.reponseMessage = error.error?.error.message;
            } else {
              this.reponseMessage = "Unexpected error occurred";
            }
            this.snackbarService.openSnackBar(this.reponseMessage, "error");
          }
        }
    });
  }

  getCurrentUserData() {
    this.authService.getUserProfile().subscribe({
      next: (response: SuccessResponse<User>) => {
        this.user = response.data;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.reponseMessage = error.error.error.message;
         } else {
           this.reponseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    });
  }

  checkIfCurrentUser() {
    this.userService.getCurrentUserId().subscribe({
      next: (response: SuccessResponse<number>) => {
        this.currentUserId = response.data;
        this.isSameUser = this.user.id === this.currentUserId;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.reponseMessage = error.error?.error.message;
         } else {
           this.reponseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    })
  }

  handleOpenUpdateProfileForm(values:User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    }
    const dialogRef = this.dialog.open(UpdateProfileFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onUpdateProfile.subscribe((response)=> {
      this.getCurrentUserData();
    });
  }

  handleOpenChangePasswordForm() {
    this.dialog.open(ResetPasswordFromComponent)
  }

  handleWriteMessage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      userId: this.currentUserId,
      receiverId: this.user.id
    }
    const dialogRef = this.dialog.open(SendMessageFormComponent, dialogConfig);
  }

  setSentiment():string {
    if (this.user.points > 100) {
      return 'sentiment_very_satisfied';
    } else if (this.user.points < 0) {
      return 'sentiment_very_dissatisfied';
    }
    return 'sentiment_neutral';
  }

  setSentimentColor():string {
    if (this.user.points > 100) {
      return 'text-blue-800';
    } else if (this.user.points < 0) {
      return 'text-red-800';
    }
    return 'text-neutral-800';
  }
}
