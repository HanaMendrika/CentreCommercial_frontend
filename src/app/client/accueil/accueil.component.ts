import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientApiService } from '../../services/client-api.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {
  promos: any[]    = [];
  boutiquesOpen: any[] = [];
  boutiques: any[] = [];
  loading = { promos: true, open: true, all: true };

  carouselIdx = 0;
  private carouselTimer: any;

  constructor(private api: ClientApiService) {}

  ngOnInit(): void {
    this.api.getPromotions().subscribe({ next: d => { this.promos = d || []; this.loading.promos = false; this.startCarousel(); }, error: () => this.loading.promos = false });
    this.api.getBoutiquesOpen().subscribe({ next: d => { this.boutiquesOpen = (d || []).slice(0,4); this.loading.open = false; }, error: () => this.loading.open = false });
    this.api.getBoutiques().subscribe({ next: d => { this.boutiques = (d || []).slice(0,8); this.loading.all = false; }, error: () => this.loading.all = false });
  }

  ngOnDestroy(): void { clearInterval(this.carouselTimer); }

  startCarousel(): void {
    clearInterval(this.carouselTimer);
    if (this.promos.length > 1) {
      this.carouselTimer = setInterval(() => this.carouselNext(), 4000);
    }
  }

  get carouselMax(): number { return Math.max(0, this.promos.length - 4); }
  get carouselDots(): number[] { return Array.from({ length: this.carouselMax + 1 }, (_, i) => i); }

  carouselNext(): void { this.carouselIdx = this.carouselIdx >= this.carouselMax ? 0 : this.carouselIdx + 1; }
  carouselPrev(): void { this.carouselIdx = this.carouselIdx <= 0 ? this.carouselMax : this.carouselIdx - 1; }
  carouselGo(i: number): void { this.carouselIdx = i; this.startCarousel(); }

  emoji(cat: string): string {
    const m: Record<string,string> = { 'Mode':'👗','Chaussures':'👟','Électronique':'📱','Beauté':'💄','Sport':'⚽','Bijoux':'💍','Livres':'📚','Restaurant':'🍽️','Café':'☕' };
    return m[cat] || '🏪';
  }

  bannerUrl(cat: string): string {
    const m: Record<string,string> = {
      'Mode':         'photo-1441984904996-e0b6ba687e04',
      'Chaussures':   'photo-1542291026-7eec264c27ff',
      'Électronique': 'photo-1518770660439-4636190af475',
      'Beauté':       'photo-1522335789203-aabd1fc54bc9',
      'Sport':        'photo-1517649763962-0c623066013b',
      'Bijoux':       'photo-1515562141207-7a88fb7ce338',
      'Livres':       'photo-1507842217343-583bb7270b66',
      'Restaurant':   'photo-1414235077428-338989a2e8c0',
      'Café':         'photo-1501339847302-ac426a4a7cbb',
      'Fast Food':    'photo-1561758033-d89a9ad46330',
      'Restauration': 'photo-1555396273-367ea4eb4db5',
    };
    const id = m[cat] || 'photo-1567958451986-2de427a4a0be';
    return `https://images.unsplash.com/${id}?w=400&q=70`;
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR');
  }
}
