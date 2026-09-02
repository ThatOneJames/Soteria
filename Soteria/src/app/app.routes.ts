import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent },
];