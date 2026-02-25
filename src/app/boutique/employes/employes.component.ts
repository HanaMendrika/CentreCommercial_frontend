import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Employés</h1>
          <p class="cc-page-sub">Gestion de votre équipe</p>
        </div>
        <button class="cc-btn-primary" (click)="openAdd()">+ Ajouter un employé</button>
      </div>

      <!-- Filtre rôle -->
      <div class="cc-filters">
        <input class="cc-input" style="width:200px" [(ngModel)]="filterRole" placeholder="Filtrer par rôle..." />
        <button class="cc-btn-primary" (click)="load()">Filtrer</button>
        <button class="cc-btn-ghost" *ngIf="filterRole" (click)="filterRole=''; load()">Effacer</button>
      </div>

      <div *ngIf="error" class="cc-error">{{ error }}</div>
      <div *ngIf="loading" class="cc-loading">Chargement...</div>

      <ng-container *ngIf="!loading">
        <div *ngIf="items.length === 0" class="cc-table-wrap">
          <div class="cc-empty">
            <div class="cc-empty-icon">👤</div>
            <p>Aucun employé enregistré</p>
          </div>
        </div>

        <div *ngIf="items.length > 0" class="cc-table-wrap">
          <table class="cc-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Contact</th>
                <th>Depuis</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let e of items">
                <td>
                  <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#e94560,#c0392b);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.85rem;color:#fff;flex-shrink:0">
                      {{ e.nom?.[0]?.toUpperCase() || 'E' }}
                    </div>
                    <strong>{{ e.nom }}</strong>
                  </div>
                </td>
                <td><span class="cc-badge cc-badge-info">{{ e.role }}</span></td>
                <td>{{ e.contact }}</td>
                <td style="font-size:.82rem;color:var(--cc-muted)">{{ e.createdAt | date:'dd/MM/yyyy' }}</td>
                <td>
                  <div class="cc-actions">
                    <button class="cc-btn-icon" (click)="openEdit(e)" title="Modifier">✏️</button>
                    <button class="cc-btn-icon danger" (click)="delete(e.idEmploye)" title="Supprimer">🗑️</button>
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
          <h3 class="cc-modal-title">{{ isEdit ? 'Modifier l\'employé' : 'Nouvel employé' }}</h3>
          <button class="cc-modal-close" (click)="close()">×</button>
        </div>
        <div *ngIf="formError" class="cc-error">{{ formError }}</div>

        <div class="cc-fg">
          <label class="cc-label">Nom complet *</label>
          <input class="cc-input" [(ngModel)]="form.nom" placeholder="Prénom Nom" />
        </div>
        <div class="cc-fg">
          <label class="cc-label">Rôle *</label>
          <input class="cc-input" [(ngModel)]="form.role" placeholder="Ex: Vendeur, Caissier..." />
        </div>
        <div class="cc-fg">
          <label class="cc-label">Contact *</label>
          <input class="cc-input" [(ngModel)]="form.contact" placeholder="Téléphone ou email" />
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
export class EmployesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;
  filterRole = '';

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    const f: any = {};
    if (this.filterRole) f.role = this.filterRole;
    this.api.getEmployes(f).subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur'; this.loading = false; }
    });
  }

  openAdd() { this.form = {}; this.isEdit = false; this.formError = ''; this.showModal = true; }
  openEdit(e: any) { this.form = { ...e }; this.isEdit = true; this.formError = ''; this.showModal = true; }
  close() { this.showModal = false; }

  save() {
    if (!this.form.nom || !this.form.role || !this.form.contact) {
      this.formError = 'Nom, rôle et contact sont requis.'; return;
    }
    this.saving = true; this.formError = '';
    const obs = this.isEdit
      ? this.api.updateEmploye(this.form.idEmploye, this.form)
      : this.api.addEmploye(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(id: string) {
    if (!confirm('Supprimer cet employé ?')) return;
    this.api.deleteEmploye(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message || 'Erreur' });
  }
}
