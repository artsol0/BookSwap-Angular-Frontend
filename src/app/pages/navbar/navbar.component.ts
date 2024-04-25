import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Router } from '@angular/router';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { LogoutDialogComponent } from '../logout-dialog/logout-dialog.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router, private authService:AuthServiceService, private dialog: MatDialog) {}

  goToAuthPage() {
    this.router.navigate(['/auth']);
  }

  goToLibraryPage() {
    this.router.navigate(['/library']);
  }

  goToWishlistPage() {
    this.router.navigate(['/wishlist']);
  }

  goToExchangesPage() {
    this.router.navigate(['/exchanges']);
  }

  goToProfilePage() {
    this.router.navigate(['/profile'])
  }

  isLoggedIn():boolean {
    return this.authService.isAuthenticated();
  }

  handleOpenLogoutDialog() {
    this.dialog.open(LogoutDialogComponent);
  }

}
