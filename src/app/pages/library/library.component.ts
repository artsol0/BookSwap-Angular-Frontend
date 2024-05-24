import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../book-card/book-card.component';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { LibraryService } from '../../services/library/library.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { AddBookFormComponent } from '../add-book-form/add-book-form.component';
import { Book } from '../../models/book/book';
import { Page } from '../../models/pageable/page';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookCardComponent, MatIconModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {

  books: Book[] = [];
  page:number = 0;
  totalBooks = 0;
  totalPages = 0;
  reponseMessage:string = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      this.getLibraryBooks();
    }
  }

  getLibraryBooks() {
    this.libraryService.getLibraryBooks(this.page).subscribe({
      next: (response: SuccessResponse<Page<Book>>) => {
        this.books = [...this.books, ...response.data.content];
        this.totalBooks = response.data.totalElements;
        this.totalPages = response.data.totalPages - 1;
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

  constructor(
    private authService:AuthServiceService, 
    private libraryService:LibraryService,  
    private snackbarService:SnackbarService, 
    private router: Router,
    private dialog: MatDialog,
  ) {}

  handleOpenAddBookForm() {
    const dialogRef = this.dialog.open(AddBookFormComponent);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddBook.subscribe((response: Book) => {
      this.books.push(response);
    });
  }

  loadMoreBooks() {
    this.page++;
    this.getLibraryBooks();
  }
}
