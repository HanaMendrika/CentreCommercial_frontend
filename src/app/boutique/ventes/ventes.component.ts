import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventes.component.html'
})
export class VentesComponent implements OnInit {
  items: any[] = [];
  stats: any = null;
  loading = false;
  error = '';
  dateDebut = '';
  dateFin = '';
  idAcheteur = '';
  idProduit = '';

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    const f: any = {};
    if (this.dateDebut) f.dateDebut = this.dateDebut;
    if (this.dateFin) f.dateFin = this.dateFin;
    if (this.idAcheteur) f.idAcheteur = this.idAcheteur;
    if (this.idProduit) f.idProduit = this.idProduit;

    this.api.getVentes(f).subscribe({
      next: d => { 
        this.items = Array.isArray(d) ? d : []; 
        this.loading = false; 
      },
      error: e => { 
        this.error = e.error?.message || 'Erreur'; 
        this.loading = false; 
      }
    });
    
    this.api.getVentesStats(f).subscribe({ 
      next: d => this.stats = d, 
      error: () => {} 
    });
  }
}