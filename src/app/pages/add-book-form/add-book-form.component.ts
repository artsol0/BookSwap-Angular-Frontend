import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookAttributesService } from '../../services/attributes/book-attributes.service';
import { LibraryService } from '../../services/library/library.service';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { Book } from '../../models/book/book';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';
import { Genre } from '../../models/attributes/genre';
import { Language } from '../../models/attributes/language';
import { Quality } from '../../models/attributes/quality';
import { Status } from '../../models/attributes/status';

@Component({
  selector: 'app-add-book-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-book-form.component.html',
  styleUrl: './add-book-form.component.scss'
})
export class AddBookFormComponent implements OnInit {
  responseMessage:string = '';
  fileName = '';
  file!: File;

  onAddBook = new EventEmitter();

  genres:Genre[] = [];
  languages:Language[] = [];
  qualities:Quality[] = [];
  statuses:Status[] = [];

  selectedGenres:number[] = [];

  constructor(
    private attributesService:BookAttributesService, 
    private snackbarService:SnackbarService, 
    private libraryService:LibraryService, 
    private dialogRef: MatDialogRef<AddBookFormComponent>) {
  }

  ngOnInit(): void {
    this.attributesService.getGenres().subscribe({
      next: (response: SuccessResponse<Genre[]>) => {
        this.genres = response.data;
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

    this.attributesService.getLanguages().subscribe({
      next: (response: SuccessResponse<Language[]>) => {
        this.languages = response.data;
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

    this.attributesService.getQualities().subscribe({
      next: (response: SuccessResponse<Quality[]>) => {
        this.qualities = response.data;
      },
      error: (error: ErrorResponse) => {
       if (error.error?.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });

    this.attributesService.getStatuses().subscribe({
      next: (response: SuccessResponse<Status[]>) => {
        this.statuses = response.data;
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

  addBookForm = new FormGroup({
    title: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    author: new FormControl("", [Validators.required, Validators.maxLength(50)]),
    description: new FormControl("", [Validators.required, Validators.maxLength(1000)]),
    genres: new FormControl("", [Validators.required]),
    language: new FormControl("", [Validators.required]),
    quality: new FormControl("", [Validators.required]),
    status: new FormControl("", [Validators.required]),
    photo: new FormControl("", [Validators.required])
  })

  handleFileSelected(event: any):void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileName = files[0].name;
      this.file = event.target.files[0];
    } else {
      this.fileName = '';
    }
  }

  handleAddNewBook() {
    const formData: FormData = new FormData();
    formData.append('title', this.addBookForm.value.title ?? '');
    formData.append('author', this.addBookForm.value.author ?? '');
    formData.append('description', this.addBookForm.value.description ?? '');
    formData.append('genreIds', this.addBookForm.value.genres ?? '');
    formData.append('qualityId', this.addBookForm.value.quality ?? '');
    formData.append('statusId', this.addBookForm.value.status ?? '');
    formData.append('languageId', this.addBookForm.value.language ?? '');
    formData.append('photo', this.file);

    this.libraryService.addNewBook(formData).subscribe({
      next: (response: SuccessResponse<Book>) => {
        this.dialogRef.close;
        this.onAddBook.emit(response.data);
        this.snackbarService.openSnackBar("Book was added successfully", "");
      },
      error: (error: ErrorResponse) => {
        this.dialogRef.close;
        if (error.error.error.message) {
          this.responseMessage = error.error.error.message;
        } else {
          this.responseMessage = "Unexpected error occurred";
        }
        this.snackbarService.openSnackBar(this.responseMessage, "error");
      }
    });
  }
}
