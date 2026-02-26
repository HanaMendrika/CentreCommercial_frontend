import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  tab: 'tous' | 'vip' = 'tous';
  items: any[] = [];
  loading = false;
  error = '';
  dateDebut = '';
  dateFin = '';
  montantMin: number | null = null;
  detail: any = null;
  detailLoading = false;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  switchTab(t: 'tous' | 'vip') { 
    this.tab = t; 
    this.load(); 
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    const filters: any = {};
    if (this.dateDebut) filters.date = this.dateDebut;
    if (this.montantMin && this.tab === 'tous') filters.montantMin = this.montantMin;
    if (this.dateDebut && this.tab === 'vip') filters.dateDebut = this.dateDebut;
    if (this.dateFin && this.tab === 'vip') filters.dateFin = this.dateFin;

    const obs = this.tab === 'vip' ? this.api.getTopClients(filters) : this.api.getClients(filters);
    
    obs.subscribe({
      next: d => { 
        this.items = Array.isArray(d) ? d : []; 
        this.loading = false; 
      },
      error: e => { 
        this.error = e.error?.message || 'Erreur'; 
        this.loading = false; 
      }
    });
  }

  viewDetail(c: any) {
    this.detail = c; 
    this.detailLoading = true;
    
    this.api.getClientById(c.idAcheteur).subscribe({
      next: d => { 
        this.detail = d; 
        this.detailLoading = false; 
      },
      error: () => this.detailLoading = false
    });
  }
}