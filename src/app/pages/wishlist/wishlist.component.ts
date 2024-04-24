import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, CommonModule, MatCardModule, MatDialogModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  
  books:any = [];
  reponseMessage = '';
  errorMessage = '';

  constructor(
    private authService:AuthServiceService, 
    private wishlistService:WishlistService,  
    private snackbarService:SnackbarService, 
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getWithlistBooks();
    } else {
      this.router.navigate(['/auth']);
    }
  }

  getWithlistBooks() {
    this.wishlistService.getWishlistBooks().subscribe({
      next: data => {
        this.books = data.data;
      },
      error: (error: any) => {
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  handleRemoveBookFromWishlist(book:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'delete',
      objectOfAction: book.title,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.removeBook(book.id);
    });
  }

  removeBook(bookId:number) {
    this.wishlistService.removeBookFromWishlist(bookId).subscribe({
      next: (response: any) => {
        this.reponseMessage = response?.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
        this.getWithlistBooks();
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

  trackById(index: number, book: any): number {
    return book.id;
  }

}
