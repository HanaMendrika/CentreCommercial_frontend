import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../services/client-api.service';

@Component({
  selector: 'app-boutiques',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './boutiques.component.html',
  styleUrls: ['./boutiques.component.css']
})
export class BoutiquesComponent implements OnInit {
  all:       any[] = [];
  filtered:  any[] = [];
  openIds  = new Set<string>();
  categories: string[] = [];

  searchQ    = '';
  activecat  = '';
  onlyOpen   = false;
  loading    = true;

  constructor(private api: ClientApiService) {}

  ngOnInit(): void {
    Promise.all([
      new Promise<void>(res => this.api.getBoutiques().subscribe({ next: d => { this.all = Array.isArray(d) ? d : []; this.buildCategories(); this.filter(); res(); }, error: () => res() })),
      new Promise<void>(res => this.api.getBoutiquesOpen().subscribe({ next: d => { this.openIds = new Set((Array.isArray(d) ? d : []).map((b: any) => b.idboutique)); res(); }, error: () => res() })),
    ]).then(() => { this.loading = false; this.filter(); });
  }

  buildCategories(): void {
    this.categories = [...new Set(this.all.map(b => b.categorie).filter(Boolean))];
  }

  setCategory(cat: string): void { this.activecat = cat; this.filter(); }

  filter(): void {
    const q = this.searchQ.toLowerCase();
    this.filtered = this.all.filter(b => {
      const name = (b.libelle || b.nom || '').toLowerCase();
      const matchQ    = !q || name.includes(q) || (b.description || '').toLowerCase().includes(q);
      const matchCat  = !this.activecat || b.categorie === this.activecat;
      const matchOpen = !this.onlyOpen || this.openIds.has(b.idboutique);
      return matchQ && matchCat && matchOpen;
    });
  }

  isOpen(id: string): boolean { return this.openIds.has(id); }
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
}
