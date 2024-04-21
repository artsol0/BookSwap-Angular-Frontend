import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { LibraryComponent } from './pages/library/library.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { BookOverviewComponent } from './pages/book-overview/book-overview.component';

export const routes: Routes = [
    {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'auth',
        component: AuthComponent
    },
    {
        path: 'library',
        component: LibraryComponent
    },
    {
        path: 'profile',
        component: UserProfileComponent
    },
    {
        path: 'book/:id',
        component: BookOverviewComponent
    }
];