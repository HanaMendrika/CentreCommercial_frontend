import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Promotions</h1>
          <p class="cc-page-sub">Gérez vos offres et réductions</p>
        </div>
        <button class="cc-btn-primary" (click)="openAdd()">+ Créer une promotion</button>
      </div>

      <!-- Filtre actif/non actif -->
      <div class="cc-tab-bar">
        <button class="cc-tab" [class.active]="filterActif === null" (click)="setFilter(null)">Toutes</button>
        <button class="cc-tab" [class.active]="filterActif === true" (click)="setFilter(true)">Actives</button>
        <button class="cc-tab" [class.active]="filterActif === false" (click)="setFilter(false)">Inactives</button>
      </div>

      <div *ngIf="error" class="cc-error">{{ error }}</div>
      <div *ngIf="loading" class="cc-loading">Chargement...</div>

      <ng-container *ngIf="!loading">
        <div *ngIf="filtered.length === 0" class="cc-table-wrap">
          <div class="cc-empty">
            <div class="cc-empty-icon">🎁</div>
            <p>Aucune promotion</p>
          </div>
        </div>

        <div *ngIf="filtered.length > 0" class="cc-table-wrap">
          <table class="cc-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Valeur</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filtered">
                <td><strong>{{ p.titre }}</strong><br><span style="color:var(--cc-muted);font-size:.78rem">{{ p.description }}</span></td>
                <td><span class="cc-badge cc-badge-info">{{ p.typeReduction }}</span></td>
                <td style="font-weight:600;color:var(--cc-accent)">
                  {{ p.valeur }}{{ p.typeReduction === 'pourcentage' ? '%' : ' Ar' }}
                </td>
                <td style="font-size:.82rem">{{ p.dateDebut | date:'dd/MM/yy' }}</td>
                <td style="font-size:.82rem">{{ p.dateFin | date:'dd/MM/yy' }}</td>
                <td>
                  <span class="cc-badge" [ngClass]="p.actif ? 'cc-badge-success' : 'cc-badge-neutral'">
                    {{ p.actif ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="cc-actions">
                    <button class="cc-btn-icon" (click)="openEdit(p)" title="Modifier">✏️</button>
                    <button class="cc-btn-icon danger" (click)="delete(p._id)" title="Supprimer">🗑️</button>
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
          <h3 class="cc-modal-title">{{ isEdit ? 'Modifier la promotion' : 'Nouvelle promotion' }}</h3>
          <button class="cc-modal-close" (click)="close()">×</button>
        </div>
        <div *ngIf="formError" class="cc-error">{{ formError }}</div>

        <div class="cc-fg">
          <label class="cc-label">Titre *</label>
          <input class="cc-input" [(ngModel)]="form.titre" placeholder="Ex: Soldes d'été" />
        </div>
        <div class="cc-fg">
          <label class="cc-label">Description</label>
          <textarea class="cc-textarea cc-input" [(ngModel)]="form.description" placeholder="Description de la promotion"></textarea>
        </div>
        <div class="cc-fg-row">
          <div class="cc-fg">
            <label class="cc-label">Type de réduction *</label>
            <select class="cc-select" [(ngModel)]="form.typeReduction">
              <option value="pourcentage">Pourcentage (%)</option>
              <option value="montant">Montant fixe (Ar)</option>
            </select>
          </div>
          <div class="cc-fg">
            <label class="cc-label">Valeur *</label>
            <input class="cc-input" type="number" [(ngModel)]="form.valeur"
                   [placeholder]="form.typeReduction === 'pourcentage' ? 'Ex: 20' : 'Ex: 5000'" />
          </div>
        </div>
        <div class="cc-fg-row">
          <div class="cc-fg">
            <label class="cc-label">Date début *</label>
            <input class="cc-input" type="date" [(ngModel)]="form.dateDebut" />
          </div>
          <div class="cc-fg">
            <label class="cc-label">Date fin *</label>
            <input class="cc-input" type="date" [(ngModel)]="form.dateFin" />
          </div>
        </div>
        <div class="cc-fg" style="display:flex;align-items:center;gap:12px">
          <input type="checkbox" [(ngModel)]="form.actif" id="actif" style="width:16px;height:16px;accent-color:var(--cc-accent)" />
          <label for="actif" class="cc-label" style="margin:0;cursor:pointer">Promotion active</label>
        </div>

        <div class="cc-modal-ft">
          <button class="cc-btn-ghost" (click)="close()">Annuler</button>
          <button class="cc-btn-primary" (click)="save()" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </div>
    </div>
  `
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

  ngOnInit() { this.load(); }

  get filtered() {
    if (this.filterActif === null) return this.items;
    return this.items.filter(p => p.actif === this.filterActif);
  }

  setFilter(v: boolean | null) { this.filterActif = v; }

  load() {
    this.loading = true; this.error = '';
    this.api.getPromotions().subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur'; this.loading = false; }
    });
  }

  openAdd() {
    this.form = { typeReduction: 'pourcentage', actif: true, dateDebut: new Date().toISOString().slice(0,10) };
    this.isEdit = false; this.formError = ''; this.showModal = true;
  }
  openEdit(p: any) {
    this.form = { ...p, dateDebut: p.dateDebut?.slice(0,10), dateFin: p.dateFin?.slice(0,10) };
    this.isEdit = true; this.formError = ''; this.showModal = true;
  }
  close() { this.showModal = false; }

  save() {
    if (!this.form.titre || !this.form.typeReduction || !this.form.valeur || !this.form.dateDebut || !this.form.dateFin) {
      this.formError = 'Les champs titre, type, valeur et dates sont requis.'; return;
    }
    this.saving = true; this.formError = '';
    const obs = this.isEdit
      ? this.api.updatePromotion(this.form._id, this.form)
      : this.api.createPromotion(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(id: string) {
    if (!confirm('Supprimer cette promotion ?')) return;
    this.api.deletePromotion(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message || 'Erreur' });
  }
}
