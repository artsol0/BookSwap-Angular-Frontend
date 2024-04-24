import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book/book.service';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { BookReviewsComponent } from '../book-reviews/book-reviews.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, BookReviewsComponent],
  templateUrl: './book-overview.component.html',
  styleUrl: './book-overview.component.scss'
})
export class BookOverviewComponent implements OnInit {

  book:any = null;
  errorMessage = '';
  reponseMessage:any;
  userIsAuth:boolean = false;

  isUserBookOwner:boolean = false;
  isBookInWishlist:boolean = false;
  isBookInExchange:boolean = false;

  constructor (
     private route: ActivatedRoute,
     private router: Router, 
     private bookService: BookService, 
     private authService:AuthServiceService, 
     private wishlistService:WishlistService,
     private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userIsAuth = this.authService.isAuthenticated();
    this.getBookData(id);
    if (this.userIsAuth) {
      this.getBookAdditonalInfo(id);
    }
  }

  getBookData(bookId:number) {
    this.book = this.bookService.getBook(bookId).subscribe({
      next: data => {
        this.book = data.data;
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

  getBookAdditonalInfo(bookId:number) {
    this.bookService.getBookAdditionalInfo(bookId).subscribe({
      next: data => {
        this.isUserBookOwner = data.data.userBookOwner;
        this.isBookInWishlist = data.data.bookInWishlist;
        this.isBookInExchange = data.data.bookInExchange;
      },
      error: (error: any) => {
        if (error.error?.error.message) {
           this.errorMessage = error.error?.error.message;
         } else {
           this.errorMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.errorMessage, "error");
       }
    })
  }

  handleWishlistAction() {
    if (this.userIsAuth) {
      if (!this.isBookInWishlist) {
        this.wishlistService.addBookToWishlist(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
          next: (response: any) => {
            this.reponseMessage = response?.message;
            this.isBookInWishlist = true;
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
      } else {
        this.wishlistService.removeBookFromWishlist(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
          next: (response: any) => {
            this.reponseMessage = response?.message;
            this.isBookInWishlist = false;
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
    } else {
      this.router.navigate(['/auth']);
    }
  }

  handleAddEchange() {
    if (this.userIsAuth) {

    } else {
      this.router.navigate(['/auth']);
    }
  }

}
