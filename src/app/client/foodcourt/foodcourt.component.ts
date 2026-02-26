import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../services/client-api.service';

@Component({
  selector: 'app-foodcourt',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './foodcourt.component.html',
  styleUrls: ['./foodcourt.component.css']
})
export class FoodcourtComponent implements OnInit {
  all:      any[] = [];
  filtered: any[] = [];
  categories: string[] = [];
  activeCat = '';
  searchQ   = '';
  loading   = true;

  selected: any = null;
  loadingDetail = false;

  constructor(private api: ClientApiService) {}

  ngOnInit(): void {
    this.api.getBoutiquesFoodcourt().subscribe({
      next: d => {
        this.all = Array.isArray(d) ? d : [];
        this.filtered = [...this.all];
        this.categories = [...new Set(this.all.map(b => b.categorie).filter(Boolean))];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  setCategory(cat: string): void { this.activeCat = cat; this.filter(); }

  filter(): void {
    const q = this.searchQ.toLowerCase();
    this.filtered = this.all.filter(b => {
      const name = (b.libelle || b.nom || '').toLowerCase();
      return (!q || name.includes(q)) && (!this.activeCat || b.categorie === this.activeCat);
    });
  }

  openDetail(id: string): void {
    this.loadingDetail = true;
    this.api.getFoodcourtBoutiqueById(id).subscribe({
      next: d => { this.selected = d; this.loadingDetail = false; },
      error: () => { this.loadingDetail = false; }
    });
  }

  closeDetail(): void { this.selected = null; }

  emoji(cat: string): string {
    const m: Record<string,string> = { 'Burger':'🍔','Pizza':'🍕','Sushi':'🍣','Café':'☕','Glaces':'🍦','Sandwichs':'🥖','Tacos':'🌮','Desserts':'🍰','Boulangerie':'🥐','Restaurant':'🍽️' };
    return m[cat] || '🍽️';
  }
}
