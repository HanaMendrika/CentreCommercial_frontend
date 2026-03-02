import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produits.component.html',
  // styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { 
    this.load(); 
  }

  load() {
    this.loading = true; 
    this.error = '';
    
    this.api.getProduits().subscribe({
      next: d => { 
        this.items = Array.isArray(d) ? d : []; 
        this.loading = false; 
      },
      error: e => { 
        this.error = e.error?.message || 'Erreur de chargement'; 
        this.loading = false; 
      }
    });
  }

  openAdd() { 
    this.form = {}; 
    this.isEdit = false; 
    this.formError = ''; 
    this.showModal = true; 
  }

  openEdit(p: any) { 
    this.form = { ...p }; 
    this.isEdit = true; 
    this.formError = ''; 
    this.showModal = true; 
  }

  close() { 
    this.showModal = false; 
  }

  save() {
    if (!this.form.libelle || !this.form.description || !this.form.idCategorieProduit || !this.form.idLiaisonCouleur || !this.form.url) {
      this.formError = 'Tous les champs sont requis.';
      return;
    }
    
    this.saving = true; 
    this.formError = '';
    
    const obs = this.isEdit
      ? this.api.updateProduit(this.form.idProduit, this.form)
      : this.api.addProduit(this.form);
    
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

  delete(idProduit: string) {
    if (!confirm('Supprimer ce produit ?')) return;
    
    this.api.deleteProduit(idProduit).subscribe({ 
      next: () => this.load(), 
      error: e => this.error = e.error?.message || 'Erreur' 
    });
  }
}