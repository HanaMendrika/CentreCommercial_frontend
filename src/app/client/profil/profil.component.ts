import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientApiService } from '../../services/client-api.service';
import { ClientAuthService } from '../../services/client-auth.service';

@Component({
  selector: 'app-profil-client',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilClientComponent implements OnInit {
  client: any = null;
  loading  = true;
  editing  = false;
  saving   = false;
  error    = '';

  form = { nom: '', mail: '', contact: '', adresse: '' };
  toast: { msg: string; type: string } | null = null;

  constructor(private api: ClientApiService, public auth: ClientAuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getClient();
    if (!user) { this.router.navigate(['/client/login']); return; }
    this.api.getProfil(user.id).subscribe({
      next: d => { this.client = d; this.resetForm(); this.loading = false; },
      error: () => { this.client = this.auth.getClient(); this.resetForm(); this.loading = false; }
    });
  }

  resetForm(): void {
    const c = this.client || {};
    this.form = { nom: c.nom || '', mail: c.mail || '', contact: c.contact || '', adresse: c.adresse || '' };
  }

  save(): void {
    this.saving = true; this.error = '';
    const id = this.auth.getClient()!.id;
    this.api.updateProfil(id, this.form).subscribe({
      next: () => {
        this.saving = false; this.editing = false;
        this.auth.updateLocalClient(this.form);
        this.client = { ...this.client, ...this.form };
        this.showToast('Profil mis à jour !', 'success');
      },
      error: (e) => { this.saving = false; this.error = e.error?.message || 'Erreur lors de la mise à jour'; }
    });
  }

  deleteAccount(): void {
    if (!confirm('Supprimer définitivement votre compte ?')) return;
    const id = this.auth.getClient()!.id;
    this.api.deleteAccount(id).subscribe({
      next: () => { this.auth.clear(); this.router.navigate(['/']); },
      error: () => {}
    });
  }

  logout(): void {
    this.auth.logout().subscribe({ error: () => {} });
    this.auth.clear();
    this.router.navigate(['/']);
  }

  showToast(msg: string, type: string): void { this.toast = { msg, type }; setTimeout(() => this.toast = null, 3500); }

  get initiale(): string { return (this.client?.nom || 'C').charAt(0).toUpperCase(); }
}
