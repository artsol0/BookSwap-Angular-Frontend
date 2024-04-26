import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { BookService } from '../../services/book/book.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatIconModule, RouterModule, MatCardModule, MatPaginatorModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  books:any = [];
  page:number = 0;
  totalBooks = 0;
  totalPages = 0;
  pageSize = 0;
  errorMessage = '';
  reponseMessage:any;

  constructor (
    private route: ActivatedRoute,
    private router: Router, 
    private bookService: BookService,
    private snackbarService: SnackbarService) {}

  ngOnInit(): void {
    this.getAllBooks(this.page,'');
  }

  getAllBooks(page:number, keyword:string) {
    this.bookService.getAllBooks(page, keyword).subscribe({
      next: data => {
        this.books = data.data.content;
        this.totalBooks = data.data.totalElements;
        this.totalPages = data.data.totalPages;
        this.pageSize = data.data.pageable.pageSize;
      },
      error: (error: any) => {
        if (error.error?.error.message) {
           this.errorMessage = error.error?.error.message;
         } else {
           this.errorMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.errorMessage, "error");
       }
    })
  }

  searchByKeyword(searchkeyword:string) {
    this.page = 0;
    this.books = [];
    this.getAllBooks(this.page, searchkeyword);
  }

  trackById(index: number, book: any): number {
    return book.id;
  }

}
