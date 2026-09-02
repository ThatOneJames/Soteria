import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminModule } from './components/admin/admin';
import { HomeModule } from './components/home/home';

@Component({
  imports: [RouterOutlet, AdminModule, HomeModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('Soteria');
}