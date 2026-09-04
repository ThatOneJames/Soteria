import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';
import { QuoteComponent } from './components/quote/quote';
import { AuthComponent, adminGuard } from './components/auth/auth';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'quote', component: QuoteComponent },
  { path: 'login', component: AuthComponent },
];