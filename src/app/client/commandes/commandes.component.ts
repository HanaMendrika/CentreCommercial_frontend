import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ClientApiService } from '../../services/client-api.service';
import { ClientAuthService } from '../../services/client-auth.service';

@Component({
  selector: 'app-commandes-client',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css']
})
export class CommandesClientComponent implements OnInit {
  commandes: any[] = [];
  loading   = true;
  toast: { msg: string; type: string } | null = null;

  constructor(private api: ClientApiService, private auth: ClientAuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getClient();
    if (!user) { this.router.navigate(['/client/login']); return; }
    this.api.getMesCommandes(user.id).subscribe({
      next: d => { this.commandes = Array.isArray(d) ? d : []; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  annuler(id: string): void {
    if (!confirm('Annuler cette commande ?')) return;
    this.api.annulerCommande(id).subscribe({
      next: () => { this.commandes = this.commandes.filter(c => c._id !== id); this.showToast('Commande annulée', 'info'); },
      error: (e) => this.showToast(e.error?.message || 'Impossible d\'annuler', 'error')
    });
  }

  statusLabel(s: string): string {
    const m: Record<string,string> = { 'en_cours': 'En cours', 'livree': 'Livrée', 'annulee': 'Annulée', 'en_attente': 'En attente' };
    return m[s] || s || 'En attente';
  }
  statusClass(s: string): string {
    const m: Record<string,string> = { 'livree': 'cl-badge-open', 'annulee': 'cl-badge-closed', 'en_cours': 'cl-badge-promo' };
    return m[s] || 'cl-badge-dark';
  }
  formatDate(d: string): string { return d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : ''; }
  showToast(msg: string, type: string): void { this.toast = { msg, type }; setTimeout(() => this.toast = null, 3500); }
}
