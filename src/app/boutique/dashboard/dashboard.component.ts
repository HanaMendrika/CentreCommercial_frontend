import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoutiqueApiService } from '../../services/boutique-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cc-page">
      <div class="cc-page-header">
        <div>
          <h1 class="cc-page-title">Tableau de bord</h1>
          <p class="cc-page-sub">Vue d'ensemble de votre boutique</p>
        </div>
      </div>

      <div class="cc-stats">
        <div class="cc-stat">
          <div class="cc-stat-label">Chiffre d'affaires</div>
          <div class="cc-stat-value accent">{{ stats?.chiffreAffaires | number:'1.0-0' }} Ar</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">Ventes totales</div>
          <div class="cc-stat-value">{{ stats?.nbVentes ?? '—' }}</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">Produits</div>
          <div class="cc-stat-value">{{ nbProduits ?? '—' }}</div>
        </div>
        <div class="cc-stat">
          <div class="cc-stat-label">Employés</div>
          <div class="cc-stat-value">{{ nbEmployes ?? '—' }}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">

        <!-- Profil boutique -->
        <div class="cc-card">
          <h3 style="color:var(--cc-text);font-size:.95rem;font-weight:700;margin:0 0 18px">
            🏪 Informations boutique
          </h3>
          <ng-container *ngIf="profil; else noProfile">
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="info-row">
                <span class="info-label">Libellé</span>
                <span class="info-val">{{ profil.libelle }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Horaires</span>
                <span class="info-val">{{ profil.ouverture }} – {{ profil.fermeture }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">URL</span>
                <span class="info-val" style="color:var(--cc-accent)">{{ profil.url }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Description</span>
                <span class="info-val">{{ profil.description }}</span>
              </div>
            </div>
          </ng-container>
          <ng-template #noProfile>
            <p style="color:var(--cc-muted);font-size:.85rem">Profil non configuré</p>
          </ng-template>
        </div>

        <!-- Top produits -->
        <div class="cc-card">
          <h3 style="color:var(--cc-text);font-size:.95rem;font-weight:700;margin:0 0 18px">
            🏆 Top produits vendus
          </h3>
          <ng-container *ngIf="stats?.topProduits?.length; else noTop">
            <div *ngFor="let p of stats.topProduits.slice(0,5); let i = index"
                 style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--cc-border)">
              <span style="color:var(--cc-muted);font-size:.8rem">
                <span style="color:var(--cc-accent);font-weight:700">#{{ i+1 }}</span>
                {{ p.idProduit }}
              </span>
              <span style="color:var(--cc-text);font-size:.85rem;font-weight:600">{{ p.quantiteVendue }} ventes</span>
            </div>
          </ng-container>
          <ng-template #noTop>
            <p style="color:var(--cc-muted);font-size:.85rem">Aucune vente enregistrée</p>
          </ng-template>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .info-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .info-label { color: var(--cc-muted); font-size: .78rem; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
    .info-val { color: var(--cc-text); font-size: .875rem; text-align: right; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: any = null;
  profil: any = null;
  nbProduits: number | null = null;
  nbEmployes: number | null = null;

  constructor(private api: BoutiqueApiService) {}

  ngOnInit() {
    this.api.getVentesStats().subscribe({ next: d => this.stats = d, error: () => {} });
    this.api.getProfil().subscribe({ next: d => this.profil = d, error: () => {} });
    this.api.getProduits().subscribe({ next: (d: any[]) => this.nbProduits = d.length, error: () => {} });
    this.api.getEmployes().subscribe({ next: (d: any[]) => this.nbEmployes = d.length, error: () => {} });
  }
}
