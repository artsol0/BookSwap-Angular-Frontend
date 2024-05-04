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

@Component({
  selector: 'app-add-book-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-book-form.component.html',
  styleUrl: './add-book-form.component.scss'
})
export class AddBookFormComponent implements OnInit {
  reponseMessage:any;
  errorMessage = '';
  fileName = '';
  file!: File;

  onAddBook = new EventEmitter();

  genres: { id: number, genre: string }[] = [];
  languages: { id: number, language: string }[] = [];
  qualities: { id: number, quality: string }[] = [];
  statuses: { id: number, status: string }[] = [];

  selectedGenres:number[] = [];

  constructor(private attributesService:BookAttributesService, private snackbarService:SnackbarService, private libraryService:LibraryService, private dialogRef: MatDialogRef<AddBookFormComponent>) {
  }

  ngOnInit(): void {
    this.attributesService.getGenres().subscribe({
      next: data => {
        this.genres = data.data;
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

    this.attributesService.getLanguages().subscribe({
      next: data => {
        this.languages = data.data;
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

    this.attributesService.getQualities().subscribe({
      next: data => {
        this.qualities = data.data;
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

    this.attributesService.getStatuses().subscribe({
      next: data => {
        this.statuses = data.data;
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

  addBookForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    author: new FormControl("", [Validators.required]),
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
      next: (response: any) => {
        this.dialogRef.close;
        this.onAddBook.emit();
        this.reponseMessage = response?.message;
        this.snackbarService.openSnackBar(this.reponseMessage, "");
      },
      error: (error: any) => {
        this.dialogRef.close;
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
