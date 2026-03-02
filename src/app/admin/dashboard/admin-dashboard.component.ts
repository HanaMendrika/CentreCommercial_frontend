import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  totalClients: number | null = null;
  topBuyers: any[] = [];
  topSpenders: any[] = [];
  topBoutiques: any[] = [];
  topProducts: any[] = [];

  salesStats: any = null;
  salesStart = '';
  salesEnd = '';
  salesLoading = false;

  clientHistory: any[] = [];
  historyId = '';
  historyLoading = false;
  historyError = '';

  activeTab: 'acheteurs' | 'depenseurs' | 'boutiques' | 'produits' = 'acheteurs';

  loading = false;
  error = '';

  constructor(private api: AdminApiService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.api.getTotalClients().subscribe({
      next: d => this.totalClients = d.totalClients,
      error: () => {}
    });
    this.api.getTopBuyers().subscribe({
      next: d => { this.topBuyers = Array.isArray(d) ? d : []; this.loading = false; },
      error: () => { this.loading = false; }
    });
    this.api.getTopSpenders().subscribe({
      next: d => this.topSpenders = Array.isArray(d) ? d : [],
      error: () => {}
    });
    this.api.getTopBoutiques().subscribe({
      next: d => this.topBoutiques = Array.isArray(d) ? d : [],
      error: () => {}
    });
    this.api.getTopProducts().subscribe({
      next: d => this.topProducts = Array.isArray(d) ? d : [],
      error: () => {}
    });
    this.loadSalesByPeriod();
  }

  loadSalesByPeriod() {
    this.salesLoading = true;
    const params: any = {};
    if (this.salesStart) params.start = this.salesStart;
    if (this.salesEnd) params.end = this.salesEnd;
    this.api.getSalesByPeriod(params).subscribe({
      next: d => { this.salesStats = d; this.salesLoading = false; },
      error: () => { this.salesLoading = false; }
    });
  }

  filterSales() {
    this.loadSalesByPeriod();
  }

  loadClientHistory() {
    if (!this.historyId.trim()) return;
    this.historyLoading = true;
    this.historyError = '';
    this.clientHistory = [];
    this.api.getClientHistory(this.historyId.trim()).subscribe({
      next: d => { this.clientHistory = Array.isArray(d) ? d : []; this.historyLoading = false; },
      error: e => { this.historyError = e.error?.message || 'Client introuvable'; this.historyLoading = false; }
    });
  }
}
