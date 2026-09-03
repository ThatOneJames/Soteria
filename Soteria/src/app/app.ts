import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminModule } from './components/admin/admin';
import { HomeModule } from './components/home/home';
import { QuoteModule } from './components/quote/quote';

@Component({
  imports: [RouterOutlet, AdminModule, HomeModule, QuoteModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Soteria');
}