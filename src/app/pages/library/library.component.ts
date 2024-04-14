import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { BookCardComponent } from '../book-card/book-card.component';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthServiceService } from '../../services/auth/auth-service.service';
import { LibraryService } from '../../services/library/library.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookCardComponent, MatIconModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent implements OnInit {

  books = [];
  reponseMessage:any;
  errorMessage = '';

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
    } else {
      this.libraryService.getLibraryBooks().subscribe({
        next: data => {
          this.books = data.data;
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
  }

  constructor(private authService:AuthServiceService, private libraryService:LibraryService,  private snackbarService:SnackbarService, private router: Router) {}
}
