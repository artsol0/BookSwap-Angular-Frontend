import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-add-book-form',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-book-form.component.html',
  styleUrl: './add-book-form.component.scss'
})
export class AddBookFormComponent {
  reponseMessage:any;
  errorMessage = '';

  constructor(private snackbarService:SnackbarService) {
  }

  addBookForm = new FormGroup({
    title: new FormControl("", [Validators.required]),
    
  })
}
