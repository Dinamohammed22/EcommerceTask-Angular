import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, withFetch } from '@angular/common/http';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideRouter(routes),
     provideClientHydration(),
     importProvidersFrom(HttpClientModule),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    )

     
    ]
};
