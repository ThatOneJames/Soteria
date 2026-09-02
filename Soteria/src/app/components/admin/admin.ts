import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';

type Tab = 'leads' | 'quotes' | 'providers' | 'cars';
type StatColor = 'blue' | 'green' | 'orange' | 'purple';
type FillColor = 'primary' | 'orange' | 'yellow';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  coverage: string;
  insurer: string;
  status: string;
  date: string;
  amount: string;
}

interface Provider {
  name: string;
  leads: number;
  policies: number;
  revenue: string;
  rating: number;
  status: string;
}

interface Car {
  brand: string;
  model: string;
  year: string;
  variants: number;
  bodytype: string;
  entries: number;
}

interface NavItem {
  id: Tab;
  label: string;
  icon: string;
  count?: number;
}

interface StatCard {
  label: string;
  val: string;
  change: string;
  icon: string;
  color: StatColor;
}

interface CoverageMixItem {
  label: string;
  pct: number;
  val: string;
  color: FillColor;
}

interface BrandItem {
  brand: string;
  count: number;
}

interface MonthlyVolumeItem {
  m: string;
  v: number;
}

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent {
  tab: Tab = 'leads';
  search = '';
  sidebarOpen = true;

  //Sample data for demonstration purposes
  leads: Lead[] = [
    { id: 'L-0041', name: 'Maria Santos', email: 'maria@gmail.com', phone: '09171234567', car: '2022 Toyota Vios', coverage: 'Comprehensive', insurer: 'AXA Philippines', status: 'Applied', date: 'Sep 1, 2025', amount: '₱18,500' },
    { id: 'L-0040', name: 'Jose Reyes', email: 'jose@yahoo.com', phone: '09281234567', car: '2023 Honda City', coverage: 'Comprehensive', insurer: 'Malayan', status: 'Quote Sent', date: 'Sep 1, 2025', amount: '₱17,200' },
    { id: 'L-0039', name: 'Ana Cruz', email: 'ana@gmail.com', phone: '09391234567', car: '2021 Mitsubishi Xpander', coverage: 'Premium Plus', insurer: 'MAPFRE', status: 'Applied', date: 'Aug 31, 2025', amount: '₱31,500' },
    { id: 'L-0038', name: 'Carlos Tan', email: 'carlo@outlook.com', phone: '09171239999', car: '2020 Ford Everest', coverage: 'CTPL', insurer: 'Malayan', status: 'Paid', date: 'Aug 30, 2025', amount: '₱650' },
    { id: 'L-0037', name: 'Liza Gomez', email: 'liza@gmail.com', phone: '09281231234', car: '2024 Kia Seltos', coverage: 'Comprehensive', insurer: 'AXA Philippines', status: 'Pending', date: 'Aug 29, 2025', amount: '₱19,800' },
    { id: 'L-0036', name: 'Robert Dela Cruz', email: 'rob@email.com', phone: '09391231234', car: '2022 Hyundai Tucson', coverage: 'Premium Plus', insurer: 'Malayan', status: 'Quote Sent', date: 'Aug 28, 2025', amount: '₱28,000' },
  ];

  providers: Provider[] = [
    { name: 'Malayan Insurance', leads: 1842, policies: 1204, revenue: '₱21.2M', rating: 4.8, status: 'Active' },
    { name: 'AXA Philippines', leads: 1536, policies: 1088, revenue: '₱19.8M', rating: 4.9, status: 'Active' },
    { name: 'MAPFRE Insular', leads: 987, policies: 721, revenue: '₱14.5M', rating: 4.7, status: 'Active' },
    { name: 'Pioneer Insurance', leads: 754, policies: 520, revenue: '₱9.8M', rating: 4.5, status: 'Active' },
    { name: 'Standard Insurance', leads: 502, policies: 340, revenue: '₱6.2M', rating: 4.4, status: 'Active' },
    { name: 'FPG Insurance', leads: 298, policies: 198, revenue: '₱3.1M', rating: 4.3, status: 'Inactive' },
  ];

  cars: Car[] = [
    { brand: 'Toyota', model: 'Vios', year: '2018–2024', variants: 4, bodytype: 'Sedan', entries: 3241 },
    { brand: 'Honda', model: 'City', year: '2019–2024', variants: 3, bodytype: 'Sedan', entries: 2187 },
    { brand: 'Mitsubishi', model: 'Xpander', year: '2018–2024', variants: 3, bodytype: 'SUV', entries: 1842 },
    { brand: 'Toyota', model: 'Fortuner', year: '2016–2024', variants: 5, bodytype: 'SUV', entries: 1654 },
    { brand: 'Hyundai', model: 'Tucson', year: '2016–2024', variants: 4, bodytype: 'SUV', entries: 1231 },
    { brand: 'Kia', model: 'Seltos', year: '2020–2024', variants: 3, bodytype: 'SUV', entries: 987 },
  ];

  statusStyleKeys: Record<string, string> = {
    Applied: 'applied',
    'Quote Sent': 'quote-sent',
    Paid: 'paid',
    Pending: 'pending',
  };

  navItems: NavItem[] = [
    { id: 'leads', label: 'Leads & Quotes', icon: '📋', count: this.leads.length },
    { id: 'quotes', label: 'Quote Analytics', icon: '📊' },
    { id: 'providers', label: 'Providers', icon: '🏢', count: this.providers.length },
    { id: 'cars', label: 'Car Database', icon: '🚗', count: this.cars.length },
  ];

  statCards: StatCard[] = [
    { label: 'Total Leads', val: '4,218', change: '+12% this month', icon: '📋', color: 'blue' },
    { label: 'Policies Issued', val: '3,071', change: '+8% this month', icon: '✅', color: 'green' },
    { label: 'Total Revenue', val: '₱74.6M', change: '+18% this month', icon: '💰', color: 'orange' },
    { label: 'Conversion Rate', val: '72.8%', change: '+3.2pp this month', icon: '📈', color: 'purple' },
  ];

  coverageMix: CoverageMixItem[] = [
    { label: 'Comprehensive', pct: 62, val: '2,615 leads', color: 'primary' },
    { label: 'CTPL Only', pct: 24, val: '1,012 leads', color: 'orange' },
    { label: 'Premium Plus', pct: 14, val: '591 leads', color: 'yellow' },
  ];

  topBrands: BrandItem[] = [
    { brand: 'Toyota', count: 1542 },
    { brand: 'Honda', count: 987 },
    { brand: 'Mitsubishi', count: 721 },
    { brand: 'Hyundai', count: 486 },
    { brand: 'Ford', count: 312 },
  ];

  monthlyVolume: MonthlyVolumeItem[] = [
    { m: 'Jan', v: 280 }, { m: 'Feb', v: 310 }, { m: 'Mar', v: 420 }, { m: 'Apr', v: 380 },
    { m: 'May', v: 460 }, { m: 'Jun', v: 510 }, { m: 'Jul', v: 590 }, { m: 'Aug', v: 640 },
    { m: 'Sep', v: 480 }, { m: 'Oct', v: 0 }, { m: 'Nov', v: 0 }, { m: 'Dec', v: 0 },
  ];

  pagination = ['←', '1', '2', '3', '→'];

  private readonly maxBrandCount = Math.max(...this.topBrands.map(b => b.count));
  private readonly maxMonthlyVolume = Math.max(...this.monthlyVolume.map(m => m.v));

  get filteredLeads(): Lead[] {
    const q = this.search.toLowerCase();
    return this.leads.filter(l =>
      `${l.name} ${l.email} ${l.car} ${l.status}`.toLowerCase().includes(q)
    );
  }

  get pageTitle(): string {
    switch (this.tab) {
      case 'leads': return 'Leads & Quotes';
      case 'quotes': return 'Quote Analytics';
      case 'providers': return 'Insurance Providers';
      case 'cars': return 'Car Database';
    }
  }

  setTab(t: Tab): void {
    this.tab = t;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getStatusClass(status: string): string {
    return 'status-badge--' + (this.statusStyleKeys[status] ?? 'default');
  }

  brandBarWidth(count: number): number {
    return (count / this.maxBrandCount) * 100;
  }

  monthBarHeight(v: number): number {
    return (v / this.maxMonthlyVolume) * 100;
  }

  starRating(rating: number): string {
    return '★'.repeat(Math.floor(rating));
  }

  trackByLeadId(_index: number, lead: Lead): string {
    return lead.id;
  }

  trackByProviderName(_index: number, provider: Provider): string {
    return provider.name;
  }

  trackByCar(_index: number, car: Car): string {
    return `${car.brand}-${car.model}`;
  }
}

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [AdminComponent],
})
export class AdminModule {}