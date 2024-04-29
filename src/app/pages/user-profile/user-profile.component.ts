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

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user:any = null;
  reponseMessage:any;
  errorMessage = '';
  currentUserId:any;
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
    this.user = this.userService.getUserDataById(id).subscribe({
      next: data => {
        this.user = data.data;
      },
      error: (error: any) => {
        if (error.error?.error.code === 404) {
          this.router.navigate(['/**'])
        } else {
            if (error.error?.error.message) {
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
    this.user = this.authService.getUserProfile().subscribe({
      next: data => {
        this.user = data.data;
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

  checkIfCurrentUser() {
    this.userService.getCurrentUserId().subscribe({
      next: data => {
        this.currentUserId = data.data;
        this.isSameUser = this.user.id === this.currentUserId;
      },
      error: (error: any) => {
        if (error.error?.error.message) {
           this.reponseMessage = error.error?.error.message;
         } else {
           this.reponseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    })
  }

  handleOpenUpdateProfileForm(values:any) {
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

  handleWriteMessage(id:string) {
    console.log(id);
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
