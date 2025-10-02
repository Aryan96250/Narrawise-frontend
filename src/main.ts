import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter([]),
    provideHttpClient()
  ]
}).catch(err => console.error(err));