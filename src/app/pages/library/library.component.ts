import { Component } from '@angular/core';
import { BookCardComponent } from '../book-card/book-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookCardComponent, MatIconModule, MatButtonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.scss'
})
export class LibraryComponent {
  books = [1,1,1,1,11,1]
}
