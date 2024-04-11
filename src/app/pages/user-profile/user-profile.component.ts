import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { RouterModule, Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(private authService:AuthServiceService, private snackbarService:SnackbarService, private router: Router) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      this.user = this.authService.getUserProfile().subscribe({
        next: data => {
          console.log("nickname: ", data.data?.nickname);
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
  }

}
