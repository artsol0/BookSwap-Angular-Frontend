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
import { NewPasswordFormComponent } from './pages/new-password-form/new-password-form.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
    { path: 'home', title: 'BookSwap - Home Page', component: HomeComponent },
    { path: 'auth', title: 'BookSwap - Login And Registration', component: AuthComponent },
    { path: 'search', title: 'BookSwap - Find Your Book', component: SearchComponent },
    { path: 'library', title: 'BookSwap - Library', component: LibraryComponent },
    { path: 'wishlist', title: 'BookSwap - Wishlist', component: WishlistComponent },
    { path: 'exchanges', title: 'BookSwap - Exchanges', component: ExchangesComponent },
    { path: 'chatting', title: 'BookSwap - Chats', component: ChatComponent },
    { path: 'profile', component: UserProfileComponent },
    { path: 'user/:id/profile', component: UserProfileComponent },
    { path: 'book/:id', component: BookOverviewComponent },
    { path: 'book/:id/location', title: "BookSwap - Book Location History", component: BookLocationHistoryComponent },
    { path: 'new-password', title: "BookSwap - Reset Password", component: NewPasswordFormComponent },
    { path: '**', title: "BookSwap - Page Not Found", component: PageNotFoundComponent }
];