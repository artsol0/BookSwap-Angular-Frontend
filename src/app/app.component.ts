import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { SearchComponent } from './pages/search/search.component';
import { FooterComponent } from './pages/footer/footer.component';
import { LibraryComponent } from './pages/library/library.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { AuthComponent } from './pages/auth/auth.component';
import { HomeComponent } from './pages/home/home.component';
import { BookOverviewComponent } from './pages/book-overview/book-overview.component';
import { BookLocationHistoryComponent } from './pages/book-location-history/book-location-history.component';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, 
    FooterComponent, LibraryComponent, WishlistComponent, 
    AuthComponent, HomeComponent, BookOverviewComponent, 
    BookLocationHistoryComponent, ExchangesComponent, SearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'bookswap';
}
