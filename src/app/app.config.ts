
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LucideAngularModule, Home, Navigation, Map, Phone, Route } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({ Home, Navigation, Map, Phone, Route })
    ),
  ],
};
