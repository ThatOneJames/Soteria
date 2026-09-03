import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

interface Step {
  icon: string;
  num: string;
  title: string;
  desc: string;
}

interface Feature {
  icon: string;
  title: string;
  desc: string;
}

type FuelType = 'Gas' | 'Diesel' | 'Hybrid' | 'Electric';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  brand = '';
  model = '';
  year = '';
  bodyType = '';
  fuelType: FuelType | '' = '';
  fuelTypes: FuelType[] = ['Gas', 'Diesel', 'Hybrid', 'Electric'];

  carModels: Record<string, string[]> = {
    Toyota: ['Vios', 'Fortuner', 'Innova', 'Hilux', 'Wigo', 'Rush'],
    Honda: ['City', 'Civic', 'CR-V', 'BR-V', 'HR-V'],
    Mitsubishi: ['Xpander', 'Montero Sport', 'Mirage', 'Strada'],
    Ford: ['Everest', 'Ranger', 'Territory', 'EcoSport'],
    Hyundai: ['Tucson', 'Accent', 'Creta', 'Stargazer'],
    Kia: ['Seltos', 'Sportage', 'Soluto', 'Carnival'],
    Nissan: ['Navara', 'Terra', 'Almera', 'Kicks'],
    Suzuki: ['Ertiga', 'Vitara', 'Swift', 'S-Presso'],
  };

  get carBrands(): string[] {
    return Object.keys(this.carModels);
  }

  get availableModels(): string[] {
    return this.brand ? this.carModels[this.brand] ?? [] : [];
  }

  years: number[] = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

  insurers: string[] = [
    'Malayan Insurance',
    'AXA Philippines',
    'MAPFRE Insular',
    'Pioneer Insurance',
    'Standard Insurance',
    'FPG Insurance',
    'Prudential Guarantee',
    'Charter Ping An',
  ];

  howSteps: Step[] = [
    { icon: '🚗', num: '01', title: 'Enter Your Car Details', desc: 'Tell us your car brand, model, and year — takes less than a minute.' },
    { icon: '📊', num: '02', title: 'Compare Quotes', desc: 'We instantly show you quotes from 8+ top Philippine insurers side by side.' },
    { icon: '✅', num: '03', title: 'Get Covered', desc: 'Pick the plan that fits your budget and apply online in minutes.' },
  ];

  whyFeatures: Feature[] = [
    { icon: '💰', title: 'Best Prices', desc: 'We compare rates across insurers so you never overpay.' },
    { icon: '⚡', title: 'Instant Quotes', desc: 'No waiting on hold — get real quotes in under 60 seconds.' },
    { icon: '🔒', title: 'LTO-Accredited', desc: 'All partner insurers are fully accredited and compliant.' },
    { icon: '🤝', title: 'Unbiased Advice', desc: "We're a comparison engine, not an insurer, so we work for you." },
  ];

  constructor(private router: Router) {}

  onBrandChange(): void {
    this.model = '';
  }

  handleSubmit(): void {
  this.router.navigate(['/quote'], {
    queryParams: { brand: this.brand, model: this.model, year: this.year, fuelType: this.fuelType },
  });
 }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [HomeComponent],
})
export class HomeModule {}