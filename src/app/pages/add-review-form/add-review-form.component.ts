import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReviewService } from '../../services/review/review.service';

@Component({
  selector: 'app-add-review-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-review-form.component.html',
  styleUrl: './add-review-form.component.scss'
})
export class AddReviewFormComponent implements OnInit {

  reponseMessage:any;
  errorMessage = '';
  details:any = {};

  onAddReview = new EventEmitter();

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData:any, private reviewService:ReviewService, private snackbarService:SnackbarService, private dialogRef: MatDialogRef<AddReviewFormComponent>) {
  }

  ngOnInit(): void {
    if (this.dialogData) {
      this.details = this.dialogData;
    }
  }

  addReviewForm = new FormGroup({
    rating: new FormControl("",[Validators.required, Validators.min(1), Validators.max(5)]),
    review: new FormControl("", [Validators.required, Validators.maxLength(1000)])
  });

  handleAddNewReview() {
    this.reviewService.addReview(Number(this.details.bookId), this.addReviewForm.value).subscribe({
      next: (response: any) => {
        this.dialogRef.close;
        this.onAddReview.emit();
        this.reponseMessage = response?.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
      },
      error: (error: any) => {
        this.dialogRef.close;
       if (error.error?.error.message) {
          this.errorMessage = error.error?.error.message;
        } else {
          this.errorMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.errorMessage, "error");
      }
    });
  }
}
