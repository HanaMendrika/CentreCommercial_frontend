import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientApiService } from '../../services/client-api.service';
import { AppIconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, RouterLink, AppIconComponent],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  tab: 'plan' | 'parking' = 'plan';

  boutiques: any[] = [];
  parking: any[] = [];
  loading = { boutiques: true, parking: false };

  // Disposition statique de la galerie marchande (col/row dans le CSS grid 5×3)
  readonly layout: { idboutique: string; col: number; row: number }[] = [
    { idboutique: 'BTQ001', col: 1, row: 1 },   // Zara
    { idboutique: 'BTQ002', col: 2, row: 1 },   // Apple Store
    { idboutique: 'BTQ004', col: 4, row: 1 },   // Sephora
    { idboutique: 'BTQ005', col: 5, row: 1 },   // FNAC
    { idboutique: 'BTQ003', col: 1, row: 3 },   // Nike
    { idboutique: 'BTQ006', col: 2, row: 3 },   // McDonald's
    { idboutique: 'BTQ007', col: 4, row: 3 },   // Starbucks
    { idboutique: 'BTQ008', col: 5, row: 3 },   // Bijou Brigitte
  ];

  constructor(private api: ClientApiService) {}

  ngOnInit() {
    this.api.getBoutiquesWithStatus().subscribe({
      next: (data) => { this.boutiques = data; this.loading.boutiques = false; },
      error: () => { this.loading.boutiques = false; }
    });
  }

  switchTab(t: 'plan' | 'parking') {
    this.tab = t;
    if (t === 'parking' && !this.parking.length) {
      this.loading.parking = true;
      this.api.getParking().subscribe({
        next: (data) => { this.parking = data; this.loading.parking = false; },
        error: () => { this.loading.parking = false; }
      });
    }
  }

  getBoutique(id: string): any {
    return this.boutiques.find(b => b.idboutique === id);
  }

  catColor(cat: string): string {
    const map: Record<string, string> = {
      'Mode': '#E91E63', 'Électronique': '#2196F3', 'Sport': '#4CAF50',
      'Beauté': '#F06292', 'Livres': '#FF9800', 'Restaurant': '#F44336',
      'Café': '#795548', 'Bijoux': '#FFC107', 'Restauration': '#FF5722',
      'Fast Food': '#FF5722',
    };
    return map[cat] || '#9E9E9E';
  }

  // Spots groupés par secteur pour l'affichage parking
  get secteurs(): { label: string; type: string; spots: any[] }[] {
    const groups: Record<string, { spots: any[]; type: string }> = {};
    for (const spot of this.parking) {
      if (!groups[spot.secteur]) groups[spot.secteur] = { spots: [], type: spot.type };
      groups[spot.secteur].spots.push(spot);
    }
    return Object.entries(groups).map(([label, g]) => ({
      label, type: g.type, spots: g.spots
    }));
  }

  get parkingStats() {
    const total = this.parking.length;
    const dispo = this.parking.filter(p => p.disponible).length;
    return { total, dispo, occupe: total - dispo };
  }

  get pct(): number {
    if (!this.parkingStats.total) return 0;
    return Math.round((this.parkingStats.dispo / this.parkingStats.total) * 100);
  }

  countOpen(): number {
    return this.boutiques.filter(b => b.isOpen).length;
  }

  countAvailable(spots: any[]): number {
    return spots.filter(s => s.disponible).length;
  }

  topRow(spots: any[]): any[] {
    return spots.slice(0, Math.ceil(spots.length / 2));
  }

  bottomRow(spots: any[]): any[] {
    return spots.slice(Math.ceil(spots.length / 2));
  }
}
