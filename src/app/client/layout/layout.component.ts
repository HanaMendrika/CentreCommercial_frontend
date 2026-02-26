import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ClientAuthService } from '../../services/client-auth.service';
import { ClientApiService } from '../../services/client-api.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  @ViewChild('searchInput') searchInputRef!: ElementRef;

  searchQuery = '';
  searchResults: { boutiques: any[]; promos: any[] } = { boutiques: [], promos: [] };
  searchOpen = false;
  searchLoading = false;
  private searchTimer: any;

  toasts: { id: number; msg: string; type: string }[] = [];
  private toastId = 0;

  constructor(
    public auth: ClientAuthService,
    private api: ClientApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Ferme la dropdown à chaque navigation
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.searchOpen = false;
      this.searchQuery = '';
    });
  }

  get client() { return this.auth.getClient(); }
  get initiale() { return this.client?.nom?.charAt(0).toUpperCase() || '?'; }

  onSearchInput(): void {
    clearTimeout(this.searchTimer);
    if (this.searchQuery.trim().length < 2) { this.searchOpen = false; return; }
    this.searchLoading = true;
    this.searchOpen = true;
    this.searchTimer = setTimeout(() => this.doSearch(), 350);
  }

  doSearch(): void {
    const q = this.searchQuery.trim();
    if (!q) return;
    this.api.getBoutiques({ search: q }).subscribe({
      next: (b) => { this.searchResults.boutiques = (b || []).slice(0, 4); this.searchLoading = false; },
      error: () => { this.searchResults.boutiques = []; this.searchLoading = false; }
    });
  }

  goToBoutique(id: string): void {
    this.searchOpen = false;
    this.router.navigate(['/boutiques', id]);
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    const el = e.target as HTMLElement;
    if (!el.closest('.cl-search-wrap') && !el.closest('.cl-search-dropdown')) {
      this.searchOpen = false;
    }
  }

  logout(): void {
    this.auth.logout().subscribe({ error: () => {} });
    this.auth.clear();
    this.router.navigate(['/']);
  }

  categoryEmoji(cat: string): string {
    const map: Record<string, string> = { 'Mode': '👗', 'Chaussures': '👟', 'Électronique': '📱', 'Beauté': '💄', 'Sport': '⚽', 'Bijoux': '💍', 'Livres': '📚', 'Restaurant': '🍽️', 'Café': '☕' };
    return map[cat] || '🏪';
  }
}
