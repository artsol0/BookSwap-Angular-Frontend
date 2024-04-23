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


@Component({
  selector: 'app-book-reviews',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RouterModule],
  templateUrl: './book-reviews.component.html',
  styleUrl: './book-reviews.component.scss'
})
export class BookReviewsComponent implements OnInit {

  reviews:any = [];
  page:number = 0;
  totalReviews = 0;
  totalPages = 0;
  errorMessage = '';
  reponseMessage:any;
  currentUserId = '';

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
        next: data => {
          this.currentUserId = data.data;
          this.reviewIsExist();
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
    this.getReviewsData(bookId);
  }

  getReviewsData(bookId:number) {
    this.reviewService.getBookReviews(bookId, this.page).subscribe({
      next: data => {
        this.reviews = [...this.reviews, ...data.data.content];
        this.totalReviews = data.data.totalElements;
        this.totalPages = data.data.totalPages - 1;
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

  reviewIsExist() {
    this.reviewService.getReviewExistence(Number(this.route.snapshot.paramMap.get('id')), Number(this.currentUserId)).subscribe({
      next: data => {
        this.reviewExist = data.data;
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
      this.reviews = [];
      this.getReviewsData(Number(this.route.snapshot.paramMap.get('id')));
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
      next: (response: any) => {
        this.reponseMessage = response?.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
        this.reviews = [];
        this.getReviewsData(Number(this.route.snapshot.paramMap.get('id')));
        this.reviewExist = false;
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

  trackById(index: number, review: any): number {
    return review.id;
  }

  numSequence(n: number): Array<number> { 
    return Array(n); 
  }
}
