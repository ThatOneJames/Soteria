import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { QuoteComponent } from './components/quote/quote';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'quote', component: QuoteComponent },
];