import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { BookService } from '../../services/book/book.service';
import { BookAttributesService } from '../../services/attributes/book-attributes.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Book } from '../../models/book';
import { Page } from '../../models/pageable/page';
import { SuccessResponse } from '../../models/reponses/SuccessResponse';
import { ErrorResponse } from '../../models/reponses/ErrorResponse';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatSidenavModule, MatSelectModule, MatIconModule, RouterModule, MatCardModule, MatPaginatorModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {

  books: Book[] = [];
  page:number = 0;
  pageEvent: PageEvent = new PageEvent;
  totalBooks = 0;
  totalPages = 0;
  pageSize = 0;

  reponseMessage:string = '';

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  genres: { id: number, genre: string }[] = [];
  languages: { id: number, language: string }[] = [];
  qualities: { id: number, quality: string }[] = [];
  statuses: { id: number, status: string }[] = [];
  selectedGenres:number[] = [];

  isFiltered:boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor (
    private route: ActivatedRoute,
    private router: Router, 
    private bookService: BookService,
    private attributesService:BookAttributesService,
    private snackbarService: SnackbarService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher) {
      this.mobileQuery = media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

  ngOnInit(): void {
    this.getAllBooks(this.page,'');

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

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  getAllBooks(page:number, keyword:string) {
    this.bookService.getAllBooks(page, keyword).subscribe({
      next: (response: SuccessResponse<Page<Book>>) => {
        this.books = response.data.content;
        this.totalBooks = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.size;
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.reponseMessage = error.error.error.message;
         } else {
           this.reponseMessage = "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    })
  }

  pageChanged(event: PageEvent){
    this.page = event.pageIndex;
    if (!this.isFiltered) {
      this.getAllBooks(this.page,'');
    } else {
      this.paginator.firstPage();
    }
  }

  searchByKeyword(searchkeyword:string) {
    this.page = 0;
    this.books = [];
    this.getAllBooks(this.page, searchkeyword);
  }

  trackById(index: number, book: any): number {
    return book.id;
  }

  filterBookForm = new FormGroup({
    genreIds: new FormControl([]),
    qualityId: new FormControl(""),
    statusId: new FormControl(""),
    languageId: new FormControl(""),
  });

  handleFilterBooks() {
    this.page = 0;
    this.books = [];
    this.isFiltered = true;
    this.getFilteredBook(this.page);
  }

  getFilteredBook(page:number) {
    this.bookService.getAllBooksByAttributes(page, this.filterBookForm.value).subscribe({
      next: (response: SuccessResponse<Page<Book>>) => {
        this.books = response.data.content;
        this.totalBooks = response.data.totalElements;
        this.totalPages = response.data.totalPages;
        this.pageSize = response.data.size;
        this.paginator.firstPage();
      },
      error: (error: ErrorResponse) => {
        if (error.error.error.message) {
           this.reponseMessage = error.error.error.message;
         } else {
           this.reponseMessage= "Unexpected error occurred";
         }
         this.snackbarService.openSnackBar(this.reponseMessage, "error");
      }
    });
  }

  handleResetFilter() {
    this.page = 0;
    this.books = [];
    this.isFiltered = false;
    this.getAllBooks(this.page, '');
  }

}
