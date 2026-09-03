import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface InsurerQuote {
  id: string;
  name: string;
  tagline: string;
  logoInitial: string;
  towing: number;
  vehicleRemoval: number;
  overnightAccommodation: number;
  casaEligibilityYears: number;
  accreditedRepairShops: number | null;
  maxTSI: number;
  alternativeTransport: boolean;
  locksmith: boolean;
  coverage: string[];
  price: number | null;
  loading: boolean;
}

// ---------------------------------------------------------------------
// Change when the real backend exists. Swap getQuotes() to call HttpClient instead of
// returning mock data, and QuoteComponent below needs zero changes.
// ---------------------------------------------------------------------

@Injectable({ providedIn: 'root' })
export class QuoteService {
  private mockProviders: Omit<InsurerQuote, 'price' | 'loading'>[] = [
    {
      id: 'stronghold', name: 'Stronghold Insurance', tagline: '🛡️ Trusted Protection at Competitive Rates', logoInitial: 'S',
      towing: 4000, vehicleRemoval: 2500, overnightAccommodation: 2500, casaEligibilityYears: 15,
      accreditedRepairShops: 504, maxTSI: 5000000, alternativeTransport: false, locksmith: true,
      coverage: ['Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline', 'Access to Critical Information'],
    },
    {
      id: 'oona', name: 'OONA Insurance', tagline: '⚡ Digital-First Car Insurance', logoInitial: 'O',
      towing: 5000, vehicleRemoval: 10000, overnightAccommodation: 3000, casaEligibilityYears: 10,
      accreditedRepairShops: 366, maxTSI: 5000000, alternativeTransport: true, locksmith: true,
      coverage: ['Access to Critical Information', 'Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline'],
    },
    {
      id: 'fpg', name: 'FPG Insurance', tagline: '🔥 Fast Claims, Strong Service', logoInitial: 'F',
      towing: 5000, vehicleRemoval: 10000, overnightAccommodation: 1500, casaEligibilityYears: 5,
      accreditedRepairShops: 172, maxTSI: 4000000, alternativeTransport: false, locksmith: true,
      coverage: ['Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline', 'Access to Critical Information'],
    },
    {
      id: 'pga', name: 'PGA Insurance', tagline: '🌸 Japanese Quality, Filipino Service', logoInitial: 'P',
      towing: 5500, vehicleRemoval: 15000, overnightAccommodation: 2000, casaEligibilityYears: 10,
      accreditedRepairShops: null, maxTSI: 3000000, alternativeTransport: false, locksmith: true,
      coverage: ['Access to Critical Information', 'Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline'],
    },
    {
      id: 'malayan', name: 'Malayan Insurance', tagline: '👑 No. 1 Non-Life Insurer in the Philippines', logoInitial: 'M',
      towing: 4000, vehicleRemoval: 8000, overnightAccommodation: 1000, casaEligibilityYears: 3,
      accreditedRepairShops: 58, maxTSI: 7500000, alternativeTransport: true, locksmith: false,
      coverage: ['Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline', 'Access to Critical Information'],
    },
    {
      id: 'standard', name: 'Standard Insurance', tagline: '🏆 Longest Casa Eligibility (15 Years)', logoInitial: 'S',
      towing: 4000, vehicleRemoval: 10000, overnightAccommodation: 2500, casaEligibilityYears: 15,
      accreditedRepairShops: 504, maxTSI: 5000000, alternativeTransport: false, locksmith: true,
      coverage: ['Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline', 'Access to Critical Information'],
    },
    {
      id: 'philfirst', name: 'Philfirst', tagline: '💰 Affordable Comprehensive Coverage', logoInitial: 'P',
      towing: 4000, vehicleRemoval: 0, overnightAccommodation: 1000, casaEligibilityYears: 10,
      accreditedRepairShops: 145, maxTSI: 6000000, alternativeTransport: false, locksmith: true,
      coverage: ['Access to Critical Information', 'Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline'],
    },
    {
      id: 'cocogen', name: 'Cocogen', tagline: '🥥 Best Value Rates with Premium Perks', logoInitial: 'C',
      towing: 5000, vehicleRemoval: 2000, overnightAccommodation: 4000, casaEligibilityYears: 10,
      accreditedRepairShops: 60, maxTSI: 5000000, alternativeTransport: true, locksmith: true,
      coverage: ['Access to Critical Information', 'Battery Boosting', 'Jumpstart', 'Flat Tire Replacement', 'Delivery of Gasoline'],
    },
  ];

  getQuotes(sumInsured: number): Observable<InsurerQuote[]> {
    // Changed method to return mock data with random prices for demonstration purposes. 
    // Use this to call an API endpoint.
    const quotes: InsurerQuote[] = this.mockProviders.map(p => ({
      ...p,
      price: Math.round((sumInsured * (0.028 + Math.random() * 0.018)) / 50) * 50,
      loading: false,
    }));
    return of(quotes).pipe(delay(400));
  }
}

interface CarDetails {
  bodyType: any;
  brand: string;
  model: string;
  year: string;
  fuelType: string;
  fuelTypes: string[];
  driverAge: number;
  yearsInsured: number;
  ncdPercent: number;
  sumInsuredMin: number;
  sumInsuredMax: number;
}

@Component({
  selector: 'app-quote',
  standalone: false,
  templateUrl: './quote.html',
  styleUrls: ['./quote.css'],
})

export class QuoteComponent implements OnInit {
  bodyTypes: string[] = [
    'Sedan',
    'Hatchback',
    'SUV',
    'MPV',
    'Pickup',
    'Coupe',
    'Convertible',
    'Wagon',
    'Van',
  ];

  fuelTypes: string[] = [
    'Gasoline',
    'Diesel',
    'Hybrid',
    'Electric',
  ];

  car: CarDetails = {
    brand: '',
    model: '',
    year: '',
    driverAge: 35,
    yearsInsured: 3,
    ncdPercent: 30,
    sumInsuredMin: 200000,
    sumInsuredMax: 350000,
    bodyType: '',
    fuelType: '',
    fuelTypes: ['Gasoline', 'Diesel', 'Hybrid', 'Electric'],
  };

  editingDetails = false;
  quotes: InsurerQuote[] = [];
  loadingQuotes = true;
  sortBy: 'price' | 'maxTSI' | 'casa' = 'price';

  constructor(private route: ActivatedRoute, private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.car.brand = params['brand'] ?? '';
      this.car.model = params['model'] ?? '';
      this.car.year = params['year'] ?? '';
      this.car.bodyType = params['bodyType'] ?? '';
      this.car.fuelType = params['fuelType'] ?? '';
    });
    this.fetchQuotes();
  }

  fetchQuotes(): void {
    this.loadingQuotes = true;
    this.quoteService.getQuotes(this.car.sumInsuredMax).subscribe(quotes => {
      this.quotes = quotes;
      this.loadingQuotes = false;
    });
  }

  get sortedQuotes(): InsurerQuote[] {
    const list = [...this.quotes];
    if (this.sortBy === 'price') return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (this.sortBy === 'maxTSI') return list.sort((a, b) => b.maxTSI - a.maxTSI);
    return list.sort((a, b) => b.casaEligibilityYears - a.casaEligibilityYears);
  }

  toggleEdit(): void {
    this.editingDetails = !this.editingDetails;
  }

  applyDetails(): void {
    this.editingDetails = false;
    this.fetchQuotes();
  }

  setSort(s: 'price' | 'maxTSI' | 'casa'): void {
    this.sortBy = s;
  }

  formatCurrency(v: number | null): string {
    if (v === null) return '—';
    return '₱' + v.toLocaleString();
  }

  trackByQuoteId(_index: number, q: InsurerQuote): string {
    return q.id;
  }
}

@NgModule({
  declarations: [QuoteComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [QuoteComponent],
})
export class QuoteModule {}