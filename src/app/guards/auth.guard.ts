// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    return false; // Deny access on server side
  }
  
  const token = localStorage.getItem('authToken');
  
  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};