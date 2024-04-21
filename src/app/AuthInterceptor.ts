import { HttpInterceptorFn, HttpErrorResponse  } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthServiceService } from './services/auth/auth-service.service';
import { inject } from '@angular/core';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthServiceService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.logout();
                router.navigate(["/auth"]);
            }
            return throwError(() => error);
        })
    );
};