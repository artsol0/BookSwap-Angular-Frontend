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
import { MessageResponse } from '../../models/reponses/MessageResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Book } from '../../models/book/book';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, RouterModule, CommonModule, MatCardModule, MatDialogModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {
  
  books:Book[] = [];
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
      next: (response: SuccessResponse<Book[]>) => {
        this.books = response.data;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.errorMessage = error.error.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }

  handleRemoveBookFromWishlist(book:Book) {
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
      next: (response: MessageResponse) => {
        this.reponseMessage = response.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
        this.getWithlistBooks();
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

  trackById(index: number, book: Book): number {
    return book.id;
  }

}
