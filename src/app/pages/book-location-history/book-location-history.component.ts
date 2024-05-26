import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book/book.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { Note } from '../../models/note';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';


@Component({
  selector: 'app-book-location-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule],
  templateUrl: './book-location-history.component.html',
  styleUrl: './book-location-history.component.scss'
})
export class BookLocationHistoryComponent implements OnInit {

  notes:Note[] = [];
  displayedColumns: string[] = ['country', 'city', 'date'];
  errorMessage:string = '';

  constructor(private route: ActivatedRoute, private bookService:BookService, private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookNotes(bookId).subscribe({
      next: (reponse: SuccessResponse<Note[]>) => {
        this.notes = reponse.data;
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

}
