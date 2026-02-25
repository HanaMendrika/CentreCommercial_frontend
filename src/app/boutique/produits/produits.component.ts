import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-produits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Produits</h1>
          <p class="cc-page-sub">Gérez le catalogue de votre boutique</p>
        </div>
        <button class="cc-btn-primary" (click)="openAdd()">+ Ajouter un produit</button>
      </div>

      <div *ngIf="error" class="cc-error">{{ error }}</div>

      <div *ngIf="loading" class="cc-loading">Chargement...</div>

      <ng-container *ngIf="!loading">
        <div *ngIf="items.length === 0" class="cc-table-wrap">
          <div class="cc-empty">
            <div class="cc-empty-icon">📦</div>
            <p>Aucun produit enregistré</p>
          </div>
        </div>

        <div *ngIf="items.length > 0" class="cc-table-wrap">
          <table class="cc-table">
            <thead>
              <tr>
                <th>Libellé</th>
                <th>Description</th>
                <th>Catégorie</th>
                <th>Couleur</th>
                <th>URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of items">
                <td><strong>{{ p.libelle }}</strong></td>
                <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{{ p.description }}</td>
                <td><span class="cc-badge cc-badge-info">{{ p.idCategorieProduit }}</span></td>
                <td>{{ p.idLiaisonCouleur }}</td>
                <td>
                  <a [href]="p.url" target="_blank"
                     style="color:var(--cc-accent);font-size:.8rem;text-decoration:none">
                    Voir ↗
                  </a>
                </td>
                <td>
                  <div class="cc-actions">
                    <button class="cc-btn-icon" (click)="openEdit(p)" title="Modifier">✏️</button>
                    <button class="cc-btn-icon danger" (click)="delete(p.idProduit)" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>

    <!-- MODAL -->
    <div class="cc-overlay" *ngIf="showModal" (click)="close()">
      <div class="cc-modal" (click)="$event.stopPropagation()">
        <div class="cc-modal-hd">
          <h3 class="cc-modal-title">{{ isEdit ? 'Modifier le produit' : 'Nouveau produit' }}</h3>
          <button class="cc-modal-close" (click)="close()">×</button>
        </div>

        <div *ngIf="formError" class="cc-error">{{ formError }}</div>

        <div class="cc-fg">
          <label class="cc-label">Libellé *</label>
          <input class="cc-input" [(ngModel)]="form.libelle" placeholder="Nom du produit" />
        </div>
        <div class="cc-fg">
          <label class="cc-label">Description *</label>
          <textarea class="cc-textarea cc-input" [(ngModel)]="form.description" placeholder="Description du produit"></textarea>
        </div>
        <div class="cc-fg-row">
          <div class="cc-fg">
            <label class="cc-label">ID Catégorie *</label>
            <input class="cc-input" [(ngModel)]="form.idCategorieProduit" placeholder="Ex: CAT-001" />
          </div>
          <div class="cc-fg">
            <label class="cc-label">ID Couleur *</label>
            <input class="cc-input" [(ngModel)]="form.idLiaisonCouleur" placeholder="Ex: COUL-001" />
          </div>
        </div>
        <div class="cc-fg">
          <label class="cc-label">URL image *</label>
          <input class="cc-input" [(ngModel)]="form.url" placeholder="https://..." />
        </div>

        <div class="cc-modal-ft">
          <button class="cc-btn-ghost" (click)="close()">Annuler</button>
          <button class="cc-btn-primary" (click)="save()" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Ajouter') }}
          </button>
        </div>
      </div>
    </div>
  `
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

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.api.getProduits().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  openAdd() { this.form = {}; this.isEdit = false; this.formError = ''; this.showModal = true; }
  openEdit(p: any) { this.form = { ...p }; this.isEdit = true; this.formError = ''; this.showModal = true; }
  close() { this.showModal = false; }

  save() {
    if (!this.form.libelle || !this.form.description || !this.form.idCategorieProduit || !this.form.idLiaisonCouleur || !this.form.url) {
      this.formError = 'Tous les champs sont requis.'; return;
    }
    this.saving = true; this.formError = '';
    const obs = this.isEdit
      ? this.api.updateProduit(this.form.idProduit, this.form)
      : this.api.addProduit(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(idProduit: string) {
    if (!confirm('Supprimer ce produit ?')) return;
    this.api.deleteProduit(idProduit).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message || 'Erreur' });
  }
}
