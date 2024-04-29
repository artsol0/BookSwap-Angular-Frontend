import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../../services/book/book.service';
import { BookAttributesService } from '../../services/attributes/book-attributes.service';

@Component({
  selector: 'app-update-book-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './update-book-form.component.html',
  styleUrl: './update-book-form.component.scss'
})
export class UpdateBookFormComponent implements OnInit {
  reponseMessage:any;
  errorMessage = '';
  fileName = '';
  file!: File;

  onUpdateBook = new EventEmitter();

  updateBookDataForm:any = FormGroup;
  updatePhotoForm:any = FormGroup;

  genres: { id: number, genre: string }[] = [];
  languages: { id: number, language: string }[] = [];
  qualities: { id: number, quality: string }[] = [];
  statuses: { id: number, status: string }[] = [];

  selectedGenres:number[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any, 
    private bookService: BookService, 
    private attributesService:BookAttributesService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<UpdateBookFormComponent>
  ) {}

  ngOnInit(): void {
    this.updatePhotoForm = this.formBuilder.group({
      photo: new FormControl("", [Validators.required])
    });
    this.updateBookDataForm = new FormGroup({
      title: new FormControl("", [Validators.required]),
      author: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      genres: new FormControl("", [Validators.required]),
      language: new FormControl("", [Validators.required]),
      quality: new FormControl("", [Validators.required]),
      status: new FormControl("", [Validators.required])
    });
    this.updateBookDataForm.patchValue(this.dialogData.data);

    this.attributesService.getGenres().subscribe({
      next: data => {
        this.genres = data.data;
        this.setGenresValue();
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
        this.setLanguageValue();
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
        this.setQualityValue();
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
        this.setStatusValue();
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

  setGenresValue() {
    const currentGenres: Array<string> = this.dialogData.data.genres;
    let toSelect: Array<any> = new Array();
    for (let i = 0; i < currentGenres.length; i++) {
      let genre = this.genres.find(g => g.genre === currentGenres[i]);
      toSelect[i] = genre?.id;
    }
    this.updateBookDataForm.get('genres').setValue(toSelect);
  }

  setLanguageValue() {
    const toSelect = this.languages.find(l => l.language === this.dialogData.data.language);
    this.updateBookDataForm.get('language').setValue(toSelect?.id);
  }

  setQualityValue() {
    const toSelect = this.qualities.find(q => q.quality === this.dialogData.data.quality);
    this.updateBookDataForm.get('quality').setValue(toSelect?.id);
  }

  setStatusValue() {
    const toSelect = this.statuses.find(s => s.status === this.dialogData.data.status);
    this.updateBookDataForm.get('status').setValue(toSelect?.id);
  }

  handleFileSelected(event: any):void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.fileName = files[0].name;
      this.file = event.target.files[0];
    } else {
      this.fileName = '';
    }
  }

  fileNameIsEmpty():boolean {
    return this.fileName === '';
  }

  handleUpdateBookPhoto() {
    const formData: FormData = new FormData();
    formData.append('photo', this.file);
  }

  handleUpdateBookData() {
    const formData: FormData = new FormData();
    formData.append('title', this.updateBookDataForm.value.title ?? '');
    formData.append('author', this.updateBookDataForm.value.author ?? '');
    formData.append('description', this.updateBookDataForm.value.description ?? '');
    formData.append('genreIds', this.updateBookDataForm.value.genres ?? '');
    formData.append('qualityId', this.updateBookDataForm.value.quality ?? '');
    formData.append('statusId', this.updateBookDataForm.value.status ?? '');
    formData.append('languageId', this.updateBookDataForm.value.language ?? '');
  }
}
