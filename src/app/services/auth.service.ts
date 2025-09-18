// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  isSuccess: boolean;
  message: string;
  errorCode: number;
  isAuthorized: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://localhost:44359/LoginEndPoint/Post';
  private refreshTokenUrl = 'https://localhost:44359/RefreshTokenEndPoint/Post';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  // Check if we're running in the browser
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.loginUrl, credentials).pipe(
      tap(response => {
        if (response.isSuccess && response.data.accessToken && response.data.refreshToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
        }
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = {
      refreshToken: refreshToken
    };

    return this.http.post<AuthResponse>(this.refreshTokenUrl, request).pipe(
      tap(response => {
        if (response.isSuccess && response.data.accessToken && response.data.refreshToken) {
          this.setTokens(response.data.accessToken, response.data.refreshToken);
        } else {
          this.logout();
        }
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.accessTokenKey, accessToken);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  getAccessToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.accessTokenKey);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.refreshTokenKey);
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser()) {
      return false; // Always return false on server side
    }
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.accessTokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
    this.router.navigate(['/login']);
  }
}