import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

@Component({
  selector: 'app-loyer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loyer.component.html',
  // styleUrls: ['./loyer.component.css']
})
export class LoyerComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;
  filterMois = '';
  filterAnnee: number | null = null;
  moisList = MOIS;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  // only include loyer entries that have been marked as paid
  get totalPaye() {
    return this.items
      .filter(l => l.idStatus === 'payé')
      .reduce((s, l) => s + (l.montant || 0), 0);
  }

  moisLabel(m: number) { 
    return MOIS[m - 1] || m; 
  }

  statusBadge(s: string) {
    if (s === 'payé') return 'cc-badge-success';
    if (s === 'en attente') return 'cc-badge-warning';
    return 'cc-badge-danger';
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    const f: any = {};
    if (this.filterMois) f.mois = this.filterMois;
    if (this.filterAnnee) f.annee = this.filterAnnee;
    
    this.api.getLoyers(f).subscribe({
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

  openAdd() {
    this.form = { 
      mois: 1, 
      annee: new Date().getFullYear(), 
      idStatus: 'payé', 
      datePaiement: new Date().toISOString().slice(0,10) 
    };
    this.isEdit = false; 
    this.formError = ''; 
    this.showModal = true;
  }

  openEdit(l: any) {
    this.form = { 
      ...l, 
      datePaiement: l.datePaiement?.slice(0, 10) 
    };
    this.isEdit = true; 
    this.formError = ''; 
    this.showModal = true;
  }

  close() { 
    this.showModal = false; 
  }

  save() {
    if (!this.form.mois || !this.form.annee || !this.form.montant || !this.form.datePaiement || !this.form.idStatus) {
      this.formError = 'Tous les champs sont requis.';
      return;
    }
    
    this.saving = true; 
    this.formError = '';
    
    const obs = this.isEdit
      ? this.api.updateLoyer(this.form.idLoyer, this.form)
      : this.api.addLoyer(this.form);
    
    obs.subscribe({
      next: () => { 
        this.saving = false; 
        this.close(); 
        this.load(); 
      },
      error: e => { 
        this.formError = e.error?.message || 'Erreur'; 
        this.saving = false; 
      }
    });
  }

  delete(id: string) {
    if (!confirm('Supprimer ce paiement ?')) return;
    
    this.api.deleteLoyer(id).subscribe({ 
      next: () => this.load(), 
      error: e => this.error = e.error?.message || 'Erreur' 
    });
  }
}