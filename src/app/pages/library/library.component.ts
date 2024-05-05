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

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookCardComponent, MatIconModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {

  books:any = [];
  page:number = 0;
  totalBooks = 0;
  totalPages = 0;
  reponseMessage:any;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      this.getLibraryBooks();
    }
  }

  getLibraryBooks() {
    this.libraryService.getLibraryBooks(this.page).subscribe({
      next: data => {
        this.books = [...this.books, ...data.data.content];
        this.totalBooks = data.data.totalElements;
        this.totalPages = data.data.totalPages - 1;
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
    const sub = dialogRef.componentInstance.onAddBook.subscribe((response)=> {
      this.books = [];
      this.getLibraryBooks();
    });
  }

  loadMoreBooks() {
    this.page++;
    this.getLibraryBooks();
  }
}
