import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-commandes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Commandes</h1>
          <p class="cc-page-sub">Gestion des commandes en ligne</p>
        </div>
        <button class="cc-btn-primary" (click)="openAdd()">+ Nouvelle commande</button>
      </div>

      <!-- Stats -->
      <div class="cc-stats">
        <div class="cc-stat">
          <div class="cc-stat-label">Total commandes</div>
          <div class="cc-stat-value">{{ items.length }}</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">En attente</div>
          <div class="cc-stat-value" style="color:#f39c12">{{ countByStatus('en attente') }}</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">Confirmées</div>
          <div class="cc-stat-value" style="color:#2ecc71">{{ countByStatus('confirmé') }}</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">Annulées</div>
          <div class="cc-stat-value" style="color:#e94560">{{ countByStatus('annulé') }}</div>
        </div>
      </div>

      <!-- Filtres -->
      <div class="cc-filters">
        <select class="cc-select" style="width:160px" [(ngModel)]="filterStatus">
          <option value="">Tous les statuts</option>
          <option value="en attente">En attente</option>
          <option value="confirmé">Confirmé</option>
          <option value="livré">Livré</option>
          <option value="annulé">Annulé</option>
        </select>
        <input class="cc-input" style="width:175px" [(ngModel)]="filterClient" placeholder="ID Client" />
        <button class="cc-btn-primary" (click)="load()">Filtrer</button>
      </div>

      <div *ngIf="error" class="cc-error">{{ error }}</div>
      <div *ngIf="loading" class="cc-loading">Chargement...</div>

      <ng-container *ngIf="!loading">
        <div *ngIf="items.length === 0" class="cc-table-wrap">
          <div class="cc-empty">
            <div class="cc-empty-icon">📋</div>
            <p>Aucune commande</p>
          </div>
        </div>

        <div *ngIf="items.length > 0" class="cc-table-wrap">
          <table class="cc-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Client</th>
                <th>Produits</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of items">
                <td><strong>{{ c.numero_commande }}</strong></td>
                <td>{{ c.idAcheteur }}</td>
                <td style="font-size:.8rem;color:var(--cc-muted)">
                  {{ c.produits?.length || 0 }} article(s)
                </td>
                <td><span class="cc-badge" [ngClass]="statusBadge(c.idstatus)">{{ c.idstatus }}</span></td>
                <td style="font-size:.82rem;color:var(--cc-muted)">{{ c.createdAt | date:'dd/MM/yyyy' }}</td>
                <td>
                  <div class="cc-actions">
                    <button class="cc-btn-icon" (click)="viewDetail(c)" title="Détail">👁️</button>
                    <button class="cc-btn-icon" (click)="openEdit(c)" title="Modifier">✏️</button>
                    <button class="cc-btn-icon danger" (click)="delete(c.idcommande)" title="Supprimer">🗑️</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ng-container>
    </div>

    <!-- MODAL AJOUT / EDIT -->
    <div class="cc-overlay" *ngIf="showModal" (click)="close()">
      <div class="cc-modal" (click)="$event.stopPropagation()" style="max-width:580px">
        <div class="cc-modal-hd">
          <h3 class="cc-modal-title">{{ isEdit ? 'Modifier la commande' : 'Nouvelle commande' }}</h3>
          <button class="cc-modal-close" (click)="close()">×</button>
        </div>
        <div *ngIf="formError" class="cc-error">{{ formError }}</div>

        <div class="cc-fg">
          <label class="cc-label">ID Client *</label>
          <input class="cc-input" [(ngModel)]="form.idAcheteur" placeholder="Ex: ACH-001" />
        </div>
        <div class="cc-fg">
          <label class="cc-label">Statut *</label>
          <select class="cc-select" [(ngModel)]="form.idstatus">
            <option value="en attente">En attente</option>
            <option value="confirmé">Confirmé</option>
            <option value="livré">Livré</option>
            <option value="annulé">Annulé</option>
          </select>
        </div>

        <!-- Produits -->
        <div class="cc-fg">
          <label class="cc-label">Produits</label>
          <div *ngFor="let p of form.produits; let i = index" style="display:flex;gap:8px;margin-bottom:8px">
            <input class="cc-input" style="flex:2" [(ngModel)]="p.idproduit" placeholder="ID Produit" />
            <input class="cc-input" style="flex:1;width:80px" type="number" [(ngModel)]="p.quantite" placeholder="Qté" min="1" />
            <button class="cc-btn-icon danger" (click)="removeProduit(i)" style="flex-shrink:0">×</button>
          </div>
          <button class="cc-btn-ghost" style="width:100%;margin-top:4px" (click)="addProduit()">+ Ajouter un produit</button>
        </div>

        <div class="cc-modal-ft">
          <button class="cc-btn-ghost" (click)="close()">Annuler</button>
          <button class="cc-btn-primary" (click)="save()" [disabled]="saving">
            {{ saving ? 'Enregistrement...' : (isEdit ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL DETAIL -->
    <div class="cc-overlay" *ngIf="detailCmd" (click)="detailCmd = null">
      <div class="cc-modal" (click)="$event.stopPropagation()">
        <div class="cc-modal-hd">
          <h3 class="cc-modal-title">{{ detailCmd.numero_commande }}</h3>
          <button class="cc-modal-close" (click)="detailCmd = null">×</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0">
          <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cc-border)">
            <span class="cc-label" style="margin:0">Client</span><span style="color:var(--cc-text)">{{ detailCmd.idAcheteur }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cc-border)">
            <span class="cc-label" style="margin:0">Statut</span>
            <span class="cc-badge" [ngClass]="statusBadge(detailCmd.idstatus)">{{ detailCmd.idstatus }}</span>
          </div>
          <div style="display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--cc-border)">
            <span class="cc-label" style="margin:0">Date</span><span style="color:var(--cc-text)">{{ detailCmd.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
        <h4 style="color:var(--cc-text);font-size:.9rem;font-weight:700;margin:20px 0 12px">Produits commandés</h4>
        <div *ngFor="let p of detailCmd.produits" style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--cc-border)">
          <span style="color:var(--cc-text)">{{ p.idproduit }}</span>
          <span class="cc-badge cc-badge-neutral">× {{ p.quantite }}</span>
        </div>
      </div>
    </div>
  `
})
export class CommandesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  showModal = false;
  isEdit = false;
  form: any = { produits: [], idstatus: 'en attente' };
  formError = '';
  saving = false;
  filterStatus = '';
  filterClient = '';
  detailCmd: any = null;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() { this.load(); }

  countByStatus(s: string) { return this.items.filter(c => c.idstatus === s).length; }

  statusBadge(s: string) {
    const map: any = { 'en attente': 'cc-badge-warning', 'confirmé': 'cc-badge-success', 'livré': 'cc-badge-info', 'annulé': 'cc-badge-danger' };
    return map[s] || 'cc-badge-neutral';
  }

  load() {
    this.loading = true; this.error = '';
    const f: any = {};
    if (this.filterStatus) f.idstatus = this.filterStatus;
    if (this.filterClient) f.idAcheteur = this.filterClient;
    this.api.getCommandes(f).subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur'; this.loading = false; }
    });
  }

  openAdd() {
    this.form = { produits: [{ idproduit: '', quantite: 1 }], idstatus: 'en attente', idAcheteur: '' };
    this.isEdit = false; this.formError = ''; this.showModal = true;
  }
  openEdit(c: any) {
    this.form = { ...c, produits: c.produits ? [...c.produits] : [] };
    this.isEdit = true; this.formError = ''; this.showModal = true;
  }
  close() { this.showModal = false; }

  addProduit() { this.form.produits.push({ idproduit: '', quantite: 1 }); }
  removeProduit(i: number) { this.form.produits.splice(i, 1); }

  viewDetail(c: any) { this.detailCmd = c; }

  save() {
    if (!this.form.idAcheteur || !this.form.idstatus) {
      this.formError = 'ID Client et statut sont requis.'; return;
    }
    this.saving = true; this.formError = '';
    const obs = this.isEdit
      ? this.api.updateCommande(this.form.idcommande, this.form)
      : this.api.createCommande(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(id: string) {
    if (!confirm('Annuler cette commande ?')) return;
    this.api.deleteCommande(id).subscribe({ next: () => this.load(), error: e => this.error = e.error?.message || 'Erreur' });
  }
}
