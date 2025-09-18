// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();
  
  // Add access token to request if available
  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  }
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if error is due to expired token (401 Unauthorized)
      if (error.status === 401 && authService.isLoggedIn()) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry the original request with new token
            const newAccessToken = authService.getAccessToken();
            const authReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newAccessToken}`
              }
            });
            return next(authReq);
          }),
          catchError(refreshError => {
            // If refresh fails, logout user
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      
      // For other errors, just rethrow
      return throwError(() => error);
    })
  );
};