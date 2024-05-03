import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SearchComponent } from './pages/search/search.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LibraryComponent } from './pages/library/library.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BookOverviewComponent } from './pages/book-overview/book-overview.component';
import { BookLocationHistoryComponent } from './pages/book-location-history/book-location-history.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ExchangesComponent } from './pages/exchanges/exchanges.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ChatComponent } from './pages/chat/chat.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
    { path: 'home', component: HomeComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'search', component: SearchComponent },
    { path: 'library', component: LibraryComponent },
    { path: 'wishlist', component: WishlistComponent },
    { path: 'exchanges', component: ExchangesComponent },
    { path: 'chatting', component: ChatComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'user/:id/profile', component: UserProfileComponent },
    { path: 'book/:id', component: BookOverviewComponent },
    { path: 'book/:id/location', component: BookLocationHistoryComponent },
    { path: '**', component: PageNotFoundComponent }
];