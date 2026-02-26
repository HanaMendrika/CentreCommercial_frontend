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
}
