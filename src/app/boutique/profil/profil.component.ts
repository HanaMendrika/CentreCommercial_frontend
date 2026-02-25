import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Profil boutique</h1>
          <p class="cc-page-sub">Informations et paramètres de votre boutique</p>
        </div>
        <button *ngIf="!editing && profil" class="cc-btn-primary" (click)="startEdit()">✏️ Modifier</button>
      </div>

      <div *ngIf="error" class="cc-error">{{ error }}</div>
      <div *ngIf="loading" class="cc-loading">Chargement...</div>

      <ng-container *ngIf="!loading && profil">

        <!-- VIEW MODE -->
        <div *ngIf="!editing" class="cc-card" style="max-width:640px">
          <div class="profil-grid">
            <div class="profil-field">
              <span class="profil-label">ID Boutique</span>
              <span class="profil-val">
                <span class="cc-badge cc-badge-neutral">{{ profil.idboutique }}</span>
              </span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Libellé</span>
              <span class="profil-val">{{ profil.libelle }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Description</span>
              <span class="profil-val">{{ profil.description }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">URL</span>
              <a [href]="profil.url" target="_blank" class="profil-val" style="color:var(--cc-accent)">{{ profil.url }}</a>
            </div>
            <div class="profil-field">
              <span class="profil-label">Ouverture</span>
              <span class="profil-val">{{ profil.ouverture }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Fermeture</span>
              <span class="profil-val">{{ profil.fermeture || '—' }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Date début</span>
              <span class="profil-val">{{ profil.dateDebut | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Date fin</span>
              <span class="profil-val">{{ profil.dateFin | date:'dd/MM/yyyy' }}</span>
            </div>
            <div class="profil-field">
              <span class="profil-label">Catégorie</span>
              <span class="profil-val">{{ profil.idCategorie }}</span>
            </div>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div *ngIf="editing" class="cc-card" style="max-width:640px">
          <div *ngIf="saveError" class="cc-error">{{ saveError }}</div>
          <div *ngIf="saveOk" style="background:rgba(46,204,113,.12);border:1px solid rgba(46,204,113,.25);border-radius:10px;padding:12px 16px;color:#2ecc71;font-size:.875rem;margin-bottom:16px">
            Profil mis à jour avec succès !
          </div>

          <div class="cc-fg">
            <label class="cc-label">Libellé</label>
            <input class="cc-input" [(ngModel)]="form.libelle" />
          </div>
          <div class="cc-fg">
            <label class="cc-label">Description</label>
            <textarea class="cc-textarea cc-input" [(ngModel)]="form.description"></textarea>
          </div>
          <div class="cc-fg">
            <label class="cc-label">URL</label>
            <input class="cc-input" [(ngModel)]="form.url" placeholder="https://..." />
          </div>
          <div class="cc-fg-row">
            <div class="cc-fg">
              <label class="cc-label">Ouverture</label>
              <input class="cc-input" [(ngModel)]="form.ouverture" placeholder="08:00" />
            </div>
            <div class="cc-fg">
              <label class="cc-label">Fermeture</label>
              <input class="cc-input" [(ngModel)]="form.fermeture" placeholder="18:00" />
            </div>
          </div>
          <div class="cc-fg-row">
            <div class="cc-fg">
              <label class="cc-label">Date début</label>
              <input class="cc-input" type="date" [(ngModel)]="form.dateDebut" />
            </div>
            <div class="cc-fg">
              <label class="cc-label">Date fin</label>
              <input class="cc-input" type="date" [(ngModel)]="form.dateFin" />
            </div>
          </div>
          <div class="cc-fg">
            <label class="cc-label">ID Catégorie</label>
            <input class="cc-input" type="number" [(ngModel)]="form.idCategorie" />
          </div>

          <div style="display:flex;gap:12px;margin-top:8px">
            <button class="cc-btn-ghost" (click)="cancelEdit()">Annuler</button>
            <button class="cc-btn-primary" (click)="save()" [disabled]="saving">
              {{ saving ? 'Enregistrement...' : 'Sauvegarder' }}
            </button>
          </div>
        </div>

      </ng-container>

      <div *ngIf="!loading && !profil && !error" class="cc-card" style="max-width:640px">
        <p style="color:var(--cc-muted)">Aucun profil trouvé pour l'ID <strong style="color:var(--cc-text)">{{ api.idBoutique }}</strong>. Vérifiez que votre boutique est créée en base.</p>
      </div>
    </div>
  `,
  styles: [`
    .profil-grid { display: flex; flex-direction: column; gap: 0; }
    .profil-field { display: flex; justify-content: space-between; align-items: flex-start; padding: 13px 0; border-bottom: 1px solid var(--cc-border); gap: 16px; }
    .profil-field:last-child { border-bottom: none; }
    .profil-label { color: var(--cc-muted); font-size: .78rem; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; white-space: nowrap; }
    .profil-val { color: var(--cc-text); font-size: .875rem; text-align: right; }
  `]
})
export class ProfilComponent implements OnInit {
  profil: any = null;
  loading = false;
  error = '';
  editing = false;
  form: any = {};
  saving = false;
  saveError = '';
  saveOk = false;

  constructor(public api: BoutiqueApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true; this.error = '';
    this.api.getProfil().subscribe({
      next: d => { this.profil = d; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Profil introuvable'; this.loading = false; }
    });
  }

  startEdit() {
    this.form = {
      ...this.profil,
      dateDebut: this.profil.dateDebut?.slice(0, 10),
      dateFin: this.profil.dateFin?.slice(0, 10)
    };
    this.saveError = ''; this.saveOk = false; this.editing = true;
  }

  cancelEdit() { this.editing = false; }

  save() {
    this.saving = true; this.saveError = ''; this.saveOk = false;
    this.api.updateProfil(this.form).subscribe({
      next: d => { this.profil = d; this.saving = false; this.saveOk = true; this.editing = false; },
      error: e => { this.saveError = e.error?.message || 'Erreur'; this.saving = false; }
    });
  }
}
