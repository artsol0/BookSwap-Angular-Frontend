import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book/book.service';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { WishlistService } from '../../services/wishlist/wishlist.service';
import { ExchangeService } from '../../services/exchange/exchange.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { BookReviewsComponent } from '../book-reviews/book-reviews.component';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../models/book/book';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { BookAdditionalInfo } from '../../models/book/bookAddtionalInfo';
import { MessageResponse } from '../../models/reponses/MessageResponse';

@Component({
  selector: 'app-book-overview',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule, BookReviewsComponent],
  templateUrl: './book-overview.component.html',
  styleUrl: './book-overview.component.scss'
})
export class BookOverviewComponent implements OnInit {

  book!:Book;
  reponseMessage:string = '';
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
     private exchangeService:ExchangeService,
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
    this.bookService.getBook(bookId).subscribe({
      next: (response: SuccessResponse<Book>) => {
        this.book = response.data;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.code === 404) {
          this.router.navigate(['/**'])
        } else {
          if (error.error.error.message) {
            this.reponseMessage= error.error.error.message;
          } else {
            this.reponseMessage = "Unexpected error occurred";
          }
          this.snackbarService.openSnackBar(this.reponseMessage, "error");
        }
       }
    });
  }

  getBookAdditonalInfo(bookId:number) {
    this.bookService.getBookAdditionalInfo(bookId).subscribe({
      next: (response: SuccessResponse<BookAdditionalInfo>) => {
        this.isUserBookOwner = response.data.userBookOwner;
        this.isBookInWishlist = response.data.bookInWishlist;
        this.isBookInExchange = response.data.bookInExchange;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.reponseMessage = error.error.error.message;
         } else {
           this.reponseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
       }
    })
  }

  handleWishlistAction() {
    if (this.userIsAuth) {
      if (!this.isBookInWishlist) {
        this.wishlistService.addBookToWishlist(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
          next: (response: MessageResponse) => {
            this.reponseMessage = response.message;
            this.isBookInWishlist = true;
            this.snackbarService.openSnackBar(this.reponseMessage, "");
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
      } else {
        this.wishlistService.removeBookFromWishlist(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
          next: (response: MessageResponse) => {
            this.reponseMessage = response.message;
            this.isBookInWishlist = false;
            this.snackbarService.openSnackBar(this.reponseMessage, "");
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
    } else {
      this.router.navigate(['/auth']);
    }
  }

  handleAddEchange() {
    if (this.userIsAuth) {
      this.exchangeService.createNewExchange(Number(this.route.snapshot.paramMap.get('id'))).subscribe({
        next: (response: MessageResponse) => {
          this.reponseMessage = response.message;
          this.isBookInExchange = true;
          this.snackbarService.openSnackBar(this.reponseMessage, "");
        },
        error: (error: ErrorResponse) => {
         if (error.error.error.message) {
            this.reponseMessage = error.error.error.message;
          } else {
            this.reponseMessage = "Unexpected error occurred";
          }
          this.snackbarService.openSnackBar(this.reponseMessage, "error");
        }
      })
    } else {
      this.router.navigate(['/auth']);
    }
  }

  isBookReadyToExchange(status:string):boolean {
    return status === 'Ready';
  }

  getWishlistButtonColor():string {
    if (!this.isBookInWishlist) {
      return 'primary';
    }
    return 'warn';
  }

}
