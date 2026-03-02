import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions.component.html'
})
export class PromotionsComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;
  filterActif: boolean | null = null;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  get filtered() {
    if (this.filterActif === null) return this.items;
    return this.items.filter(p => p.actif === this.filterActif);
  }

  setFilter(v: boolean | null) { 
    this.filterActif = v; 
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    this.api.getPromotions().subscribe({
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
      typeReduction: 'pourcentage', 
      actif: true, 
      dateDebut: new Date().toISOString().slice(0,10) 
    };
    this.isEdit = false; 
    this.formError = ''; 
    this.showModal = true;
  }

  openEdit(p: any) {
    this.form = { 
      ...p, 
      dateDebut: p.dateDebut?.slice(0,10), 
      dateFin: p.dateFin?.slice(0,10) 
    };
    this.isEdit = true; 
    this.formError = ''; 
    this.showModal = true;
  }

  close() { 
    this.showModal = false; 
  }

  save() {
    if (!this.form.titre || !this.form.typeReduction || !this.form.valeur || !this.form.dateDebut || !this.form.dateFin) {
      this.formError = 'Les champs titre, type, valeur et dates sont requis.';
      return;
    }
    
    this.saving = true; 
    this.formError = '';
    
    const obs = this.isEdit
      ? this.api.updatePromotion(this.form._id, this.form)
      : this.api.createPromotion(this.form);
    
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
    if (!confirm('Supprimer cette promotion ?')) return;
    
    this.api.deletePromotion(id).subscribe({ 
      next: () => this.load(), 
      error: e => this.error = e.error?.message || 'Erreur' 
    });
  }
}