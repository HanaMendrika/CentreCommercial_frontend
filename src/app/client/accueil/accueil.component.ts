import { Component, OnInit } from '@angular/core';
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
export class AccueilComponent implements OnInit {
  promos: any[]    = [];
  boutiquesOpen: any[] = [];
  boutiques: any[] = [];
  loading = { promos: true, open: true, all: true };

  constructor(private api: ClientApiService) {}

  ngOnInit(): void {
    this.api.getPromotions().subscribe({ next: d => { this.promos = (d || []).slice(0,6); this.loading.promos = false; }, error: () => this.loading.promos = false });
    this.api.getBoutiquesOpen().subscribe({ next: d => { this.boutiquesOpen = (d || []).slice(0,4); this.loading.open = false; }, error: () => this.loading.open = false });
    this.api.getBoutiques().subscribe({ next: d => { this.boutiques = (d || []).slice(0,8); this.loading.all = false; }, error: () => this.loading.all = false });
  }

  emoji(cat: string): string {
    const m: Record<string,string> = { 'Mode':'👗','Chaussures':'👟','Électronique':'📱','Beauté':'💄','Sport':'⚽','Bijoux':'💍','Livres':'📚','Restaurant':'🍽️','Café':'☕' };
    return m[cat] || '🏪';
  }

  formatDate(d: string): string {
    if (!d) return '';
    return new Date(d).toLocaleDateString('fr-FR');
  }
}
