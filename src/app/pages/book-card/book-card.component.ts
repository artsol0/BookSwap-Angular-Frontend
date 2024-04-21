import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { LibraryService } from '../../services/library/library.service';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { LibraryComponent } from '../library/library.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule,  MatDialogModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss'
})
export class BookCardComponent {
  @Input() book:any

  reponseMessage:any;
  errorMessage = '';

  constructor(private dialog:MatDialog, private libraryService:LibraryService, private snackbarService:SnackbarService, private libraryComponent: LibraryComponent) {}

  handleDeleteBook(book:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'delete',
      objectOfAction: book.title,
      confirmation: true
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteBook(book.id);
    });
  }

  deleteBook(id:any) {
    this.libraryService.deleteBook(id).subscribe({
      next: (response: any) => {
        this.reponseMessage = response?.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
        this.libraryComponent.getLibraryBooks();
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
