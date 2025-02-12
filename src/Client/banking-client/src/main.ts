import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppRoutingModule } from './app/app-routing.module';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideDialogConfig } from '@ngneat/dialog';

if (environment.production) {
  enableProdMode();
}
const dialogProvider = provideDialogConfig({
  sizes: {
    sm: {
      width: 600, // 300px
      minHeight: 400, // 250px
    },
    md: {
      width: '60vw',
      height: '60vh',
    },
    lg: {
      width: '90vw',
      height: '90vh',
    },
    fullScreen: {
      width: '100vw',
      height: '100vh',
    },
  },
});
bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule, AppRoutingModule), dialogProvider, provideAnimations(), provideHotToastConfig()]
}).catch((err) => console.error(err));
