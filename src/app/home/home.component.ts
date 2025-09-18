// src/app/home/home.component.ts
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenRefreshService } from '../services/token-refresh.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  isLoggedIn = false;
  private isBrowser: boolean;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private tokenRefreshService: TokenRefreshService,
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isBrowser && this.isLoggedIn) {
      this.tokenRefreshService.startTokenRefreshTimer();
    }
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.tokenRefreshService.stopTokenRefreshTimer();
    }
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error = 'Could not load products. Please try again later.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    if (this.isBrowser) {
      this.tokenRefreshService.stopTokenRefreshTimer();
    }
    this.authService.logout();
  }
}