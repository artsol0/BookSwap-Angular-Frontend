import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { ReviewService } from '../../services/review/review.service';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { UserService } from '../../services/user/user.service';
import { AddReviewFormComponent } from '../add-review-form/add-review-form.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { Review } from '../../models/review';
import { Page } from '../../models/pageable/page';
import { MessageResponse } from '../../models/reponses/MessageResponse';


@Component({
  selector: 'app-book-reviews',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './book-reviews.component.html',
  styleUrl: './book-reviews.component.scss'
})
export class BookReviewsComponent implements OnInit {

  reviews:Review[] = [];
  page:number = 0;
  totalReviews:number = 0;
  totalPages:number  = 0;
  responseMessage:string = '';
  currentUserId!:number;

  reviewExist:boolean = true;

  constructor (
    private route: ActivatedRoute, 
    private reviewService:ReviewService, 
    private snackbarService: SnackbarService, 
    private authService:AuthServiceService, 
    private userService:UserService,
    private dialog: MatDialog, 
    private router: Router) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.authService.isAuthenticated()) {
      this.userService.getCurrentUserId().subscribe({
        next: (response: SuccessResponse<number>) => {
          this.currentUserId = response.data;
          this.reviewIsExist();
        },
        error: (error: ErrorResponse) => {
         if (error.error.error.message) {
            this.responseMessage = error.error.error.message;
          } else {
            this.responseMessage = "Unexpected error occurred";
          }
          this.snackbarService.openSnackBar(this.responseMessage, "error");
        }
      });
    }
    this.getReviewsData(bookId);
  }

  getReviewsData(bookId:number) {
    this.reviewService.getBookReviews(bookId, this.page).subscribe({
      next: (response: SuccessResponse<Page<Review>>) => {
        this.reviews = [...this.reviews, ...response.data.content];
        this.totalReviews = response.data.totalElements;
        this.totalPages = response.data.totalPages - 1;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  } 

  reviewIsExist() {
    this.reviewService.getReviewExistence(Number(this.route.snapshot.paramMap.get('id')), this.currentUserId).subscribe({
      next: (response: SuccessResponse<boolean>) => {
        this.reviewExist = response.data;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  }

  loadMoreReviews() {
    this.page++;
    this.getReviewsData(Number(this.route.snapshot.paramMap.get('id')));
  }

  handleOpenAddReviewForm() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      bookId:this.route.snapshot.paramMap.get('id')
    }
    const dialogRef = this.dialog.open(AddReviewFormComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddReview.subscribe((response)=> {
      this.reviews.push(response);
      this.reviewExist = true;
    });
  }

  handleDeleteReview() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'delete',
      objectOfAction: 'review',
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteReview();
    });
  }

  deleteReview() {
    this.reviewService.deleteReview(Number(this.route.snapshot.paramMap.get('id')), Number(this.currentUserId)).subscribe({
      next: (response: MessageResponse) => {
        this.responseMessage = response.message;
        this.snackbarService.openSnackBar(this.responseMessage, "");
        this.reviews = [];
        this.getReviewsData(Number(this.route.snapshot.paramMap.get('id')));
        this.reviewExist = false;
      },
      error: (error: ErrorResponse) => {
       if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  }

  trackById(index: number, review: Review): number {
    return review.userId;
  }

  numSequence(n: number): Array<number> { 
    return Array(n); 
  }
}
