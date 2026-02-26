import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../services/client-api.service';
import { ClientAuthService } from '../../services/client-auth.service';

@Component({
  selector: 'app-boutique-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './boutique-detail.component.html',
  styleUrls: ['./boutique-detail.component.css']
})
export class BoutiqueDetailComponent implements OnInit {
  id = '';
  boutique: any = null;
  produits:  any[] = [];
  produitsFiltres: any[] = [];
  horaires:  any   = null;
  promos:    any[] = [];
  avis:      any[] = [];
  categories: string[] = [];

  activeTab = 'produits';
  activeCat = '';
  loading   = true;
  loadingAvis = true;

  // Modal commande
  showModal   = false;
  selectedProd: any = null;
  cmdQty      = 1;
  cmdAdresse  = '';
  cmdLoading  = false;
  cmdError    = '';

  // Avis
  avisNote        = 0;
  avisHovered     = 0;
  avisCommentaire = '';
  avisProduitId   = '';
  avisLoading     = false;
  avisError       = '';

  toast: { msg: string; type: string } | null = null;

  constructor(private api: ClientApiService, public auth: ClientAuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    if (!this.id) { this.router.navigate(['/boutiques']); return; }
    this.load();
  }

  load(): void {
    Promise.all([
      new Promise<void>(res => this.api.getBoutiqueById(this.id).subscribe({ next: d => { this.boutique = d; res(); }, error: () => res() })),
      new Promise<void>(res => this.api.getBoutiqueProduits(this.id).subscribe({ next: d => { this.produits = Array.isArray(d) ? d : []; this.produitsFiltres = [...this.produits]; this.categories = [...new Set(this.produits.map((p:any) => p.categorie).filter(Boolean))]; res(); }, error: () => res() })),
      new Promise<void>(res => this.api.getBoutiqueHoraire(this.id).subscribe({ next: d => { this.horaires = d; res(); }, error: () => res() })),
      new Promise<void>(res => this.api.getPromotions({ boutique: this.id }).subscribe({ next: d => { this.promos = Array.isArray(d) ? d : []; res(); }, error: () => res() })),
    ]).then(() => { this.loading = false; this.loadAvis(); });
  }

  loadAvis(): void {
    this.loadingAvis = true;
    if (!this.produits.length) { this.loadingAvis = false; return; }
    const batch = this.produits.slice(0, 4);
    let done = 0;
    const all: any[] = [];
    batch.forEach((p: any) => {
      this.api.getAvis(p._id).subscribe({
        next: (list) => { (Array.isArray(list) ? list : []).forEach((a: any) => all.push({ ...a, produitNom: p.libelle })); },
        error: () => {},
        complete: () => { done++; if (done === batch.length) { this.avis = all; this.loadingAvis = false; } }
      });
    });
  }

  filterProduits(cat: string): void {
    this.activeCat = cat;
    this.produitsFiltres = cat ? this.produits.filter(p => p.categorie === cat) : [...this.produits];
  }

  openCommande(p: any): void {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/client/login'], { queryParams: { next: this.router.url } }); return; }
    this.selectedProd = p; this.cmdQty = 1; this.cmdAdresse = ''; this.cmdError = ''; this.showModal = true;
  }
  closeModal(): void { this.showModal = false; this.selectedProd = null; }

  submitCommande(): void {
    if (!this.cmdAdresse.trim()) { this.cmdError = 'Entrez une adresse de livraison'; return; }
    this.cmdLoading = true; this.cmdError = '';
    this.api.passerCommande({ produits: [{ produit: this.selectedProd._id, quantite: this.cmdQty }], adresseLivraison: this.cmdAdresse }).subscribe({
      next: () => { this.cmdLoading = false; this.closeModal(); this.showToast('Commande passée avec succès !', 'success'); },
      error: (e) => { this.cmdLoading = false; this.cmdError = e.error?.message || 'Erreur lors de la commande'; }
    });
  }

  setNote(n: number): void { this.avisNote = n; }
  submitAvis(): void {
    if (!this.avisProduitId) { this.avisError = 'Choisissez un produit'; return; }
    if (!this.avisNote)      { this.avisError = 'Choisissez une note'; return; }
    if (!this.avisCommentaire.trim()) { this.avisError = 'Écrivez un commentaire'; return; }
    this.avisLoading = true; this.avisError = '';
    this.api.addAvis(this.avisProduitId, { note: this.avisNote, commentaire: this.avisCommentaire }).subscribe({
      next: () => { this.avisLoading = false; this.avisNote = 0; this.avisCommentaire = ''; this.loadAvis(); this.showToast('Avis publié !', 'success'); },
      error: (e) => { this.avisLoading = false; this.avisError = e.error?.message || 'Erreur'; }
    });
  }
  deleteAvis(id: string): void {
    if (!confirm('Supprimer cet avis ?')) return;
    this.api.deleteAvis(id).subscribe({ next: () => { this.loadAvis(); this.showToast('Avis supprimé', 'info'); }, error: () => {} });
  }

  showToast(msg: string, type: string): void {
    this.toast = { msg, type };
    setTimeout(() => this.toast = null, 3500);
  }

  stars(note: number): boolean[] { return Array.from({ length: 5 }, (_, i) => i < note); }
  emoji(cat: string): string {
    const m: Record<string,string> = { 'Mode':'👗','Chaussures':'👟','Électronique':'📱','Beauté':'💄','Sport':'⚽','Bijoux':'💍','Livres':'📚','Restaurant':'🍽️','Café':'☕' };
    return m[cat] || '🏪';
  }

  get horairesArray(): any[] {
    const jours = ['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'];
    const labels = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
    const todayIdx = (new Date().getDay() + 6) % 7;
    if (!Array.isArray(this.horaires)) return [];
    return jours.map((j, i) => {
      const h = this.horaires.find((x: any) => x.jour?.toLowerCase() === j);
      return { label: labels[i], horaire: h ? `${h.ouverture} - ${h.fermeture}` : 'Fermé', isToday: i === todayIdx };
    });
  }

  get clientId(): string { return this.auth.getClient()?.id || ''; }
}
