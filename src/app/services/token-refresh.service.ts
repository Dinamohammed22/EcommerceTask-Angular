// src/app/services/token-refresh.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './auth.service';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';

interface DecodedToken {
  exp: number;
  iat: number;
  // Add other properties from your token if needed
}

@Injectable({
  providedIn: 'root'
})
export class TokenRefreshService {
  private refreshTimeout: any;
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  startTokenRefreshTimer(): void {
    if (!this.isBrowser) {
      return; // Don't run on server
    }

    const accessToken = this.authService.getAccessToken();
    
    if (!accessToken) {
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(accessToken);
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - (60 * 1000); // Refresh 1 minute before expiry

      if (timeout > 0) {
        this.refreshTimeout = setTimeout(() => {
          this.authService.refreshToken().subscribe({
            next: () => {
              this.startTokenRefreshTimer(); // Restart timer with new token
            },
            error: () => {
              this.authService.logout();
            }
          });
        }, timeout);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  stopTokenRefreshTimer(): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  }
}