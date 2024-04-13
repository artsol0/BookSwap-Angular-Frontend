import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { RouterModule, Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateProfileFormComponent } from '../update-profile-form/update-profile-form.component';
import { ResetPasswordFromComponent } from '../reset-password-from/reset-password-from.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  user:any = null;
  reponseMessage:any;
  errorMessage = '';

  constructor(private authService:AuthServiceService, private snackbarService:SnackbarService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      this.getUserData();
    }
  }

  getUserData() {
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
      this.getUserData();
    });
  }

  handleOpenChangePasswordForm() {
    this.dialog.open(ResetPasswordFromComponent)
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
