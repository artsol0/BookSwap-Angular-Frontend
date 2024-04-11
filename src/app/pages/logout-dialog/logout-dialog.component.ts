import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, RouterModule],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss'
})
export class LogoutDialogComponent {
  constructor(private authService:AuthServiceService, private dialog: MatDialog, private router: Router) {
  }

  handleLogout() {
    console.log("logout");
    this.authService.logout();
    this.router.navigate(["/auth"]);
  }
}
