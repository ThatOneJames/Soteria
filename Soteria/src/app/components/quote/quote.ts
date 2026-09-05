import { Component, NgModule, OnInit, Injectable, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Observable, of, delay } from 'rxjs';
import { AuthService } from '../auth/auth';

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
    // Returns mock data with random prices for demonstration purposes.
    // Change to ENDPOINT call to backend API when available.
    const quotes: InsurerQuote[] = this.mockProviders.map(p => ({
      ...p,
      price: Math.round((sumInsured * (0.028 + Math.random() * 0.018)) / 50) * 50,
      loading: false,
    }));
    return of(quotes).pipe(delay(400));
  }
}

export type PrimaryUse = 'Private' | 'Grab / TNVS' | 'Other';

export interface LeadPayload {
  insurerId: string;
  insurerName: string;
  price: number | null;
  brand: string;
  model: string;
  year: string;
  bodyType: string;
  fuelType: string;
  primaryUse: PrimaryUse;
  ctplInterested: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wantsUpdates: boolean;
}

export interface LeadResult {
  success: boolean;
  message: string;
}

// ---------------------------------------------------------------------
// Lead capture - Creates data (NOT USER!)
// ('/api/leads', payload); [For backend API???]
// Backend must send email to customer and Insert in Leads in DB.
// QuoteComponent doesn't need to change either way.
// ---------------------------------------------------------------------
@Injectable({ providedIn: 'root' })
export class LeadService {
  submitLead(payload: LeadPayload): Observable<LeadResult> {
    console.log('[mock] Lead submitted (would email + save to DB):', payload);
    return of({
      success: true,
      message: `Thanks, ${payload.firstName}! Your quote request has been sent — check your email shortly.`,
    }).pipe(delay(600));
  }
}

interface CarDetails {
  brand: string;
  model: string;
  year: string;
  bodyType: string;
  fuelType: string;
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
    bodyType: '',
    fuelType: '',
    driverAge: 35,
    yearsInsured: 3,
    ncdPercent: 30,
    sumInsuredMin: 200000,
    sumInsuredMax: 350000,
  };

  editingDetails = false;
  quotes: InsurerQuote[] = [];
  loadingQuotes = true;
  sortBy: 'price' | 'maxTSI' | 'casa' = 'price';

  modalOpen = false;
  modalStep: 1 | 2 = 1;
  selectedQuote: InsurerQuote | null = null;
  primaryUse: PrimaryUse = 'Private';
  ctplInterested = false;

  leadForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    wantsUpdates: true,
  };

  submittingLead = false;
  leadErrorMessage = '';
  leadSuccessMessage = '';

  constructor(
    private route: ActivatedRoute,
    private quoteService: QuoteService,
    private leadService: LeadService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.car.brand = params['brand'] ?? '';
      this.car.model = params['model'] ?? '';
      this.car.year = params['year'] ?? '';
      this.car.bodyType = params['bodyType'] ?? '';
      this.car.fuelType = params['fuelType'] ?? '';
      this.cdr.markForCheck();
    });
    this.fetchQuotes();

    const user = this.authService.currentUser;
    if (user) {
      this.leadForm.firstName = user.firstName;
      this.leadForm.lastName = user.lastName;
      this.leadForm.email = user.email;
    }
  }

  fetchQuotes(): void {
    this.loadingQuotes = true;
    this.quoteService.getQuotes(this.car.sumInsuredMax).subscribe({
      next: quotes => {
        this.quotes = quotes;
        this.loadingQuotes = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('getQuotes failed:', err);
        this.loadingQuotes = false;
        this.cdr.markForCheck();
      },
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

  // Leads modal actions

  openLeadModal(quote: InsurerQuote): void {
    this.selectedQuote = quote;
    this.modalStep = 1;
    this.leadErrorMessage = '';
    this.leadSuccessMessage = '';
    this.modalOpen = true;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.selectedQuote = null;
  }

  goToStep2(): void {
    this.modalStep = 2;
  }

  backToStep1(): void {
    this.modalStep = 1;
  }

  setPrimaryUse(use: PrimaryUse): void {
    this.primaryUse = use;
  }

  submitLead(): void {
    this.leadErrorMessage = '';

    if (!this.leadForm.firstName || !this.leadForm.lastName || !this.leadForm.email || !this.leadForm.phone) {
      this.leadErrorMessage = 'Please fill in all fields.';
      return;
    }

    if (!this.selectedQuote) return;

    this.submittingLead = true;
    const payload: LeadPayload = {
      insurerId: this.selectedQuote.id,
      insurerName: this.selectedQuote.name,
      price: this.selectedQuote.price,
      brand: this.car.brand,
      model: this.car.model,
      year: this.car.year,
      bodyType: this.car.bodyType,
      fuelType: this.car.fuelType,
      primaryUse: this.primaryUse,
      ctplInterested: this.ctplInterested,
      ...this.leadForm,
    };

    this.leadService.submitLead(payload).subscribe({
      next: result => {
        this.submittingLead = false;
        this.leadSuccessMessage = result.message;
        this.cdr.markForCheck();
      },
      error: () => {
        this.submittingLead = false;
        this.leadErrorMessage = 'Something went wrong. Please try again.';
        this.cdr.markForCheck();
      },
    });
  }
}

@NgModule({
  declarations: [QuoteComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [QuoteComponent],
})
export class QuoteModule {}