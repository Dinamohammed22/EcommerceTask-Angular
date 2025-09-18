// src/app/app.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from './services/auth.service';
import { TokenRefreshService } from './services/token-refresh.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'EcommerceTask';
  private isBrowser: boolean;

  constructor(
    private authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // Only run token refresh logic in the browser
    if (this.isBrowser) {
      // Start token refresh timer if user is logged in
      if (this.authService.isLoggedIn()) {
        this.tokenRefreshService.startTokenRefreshTimer();
      }

      // Listen for route changes to manage token refresh
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          if (this.authService.isLoggedIn()) {
            this.tokenRefreshService.startTokenRefreshTimer();
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.tokenRefreshService.stopTokenRefreshTimer();
    }
  }
}