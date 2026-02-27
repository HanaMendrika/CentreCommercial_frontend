import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';

type FilterMode = 'all' | 'open' | 'closed' | 'paye' | 'nonpaye';

@Component({
  selector: 'app-admin-boutiques',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boutiques.component.html',
})
export class AdminBoutiquesComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';
  filterMode: FilterMode = 'all';

  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  showLoyerModal = false;
  loyerData: any[] = [];
  loyerMode: 'paye' | 'nonpaye' = 'paye';
  loyerLoading = false;

  constructor(private api: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    const call = this.filterMode === 'open' ? this.api.getOpenBoutiques()
      : this.filterMode === 'closed' ? this.api.getClosedBoutiques()
      : this.filterMode === 'paye' ? this.api.getLoyerPaye()
      : this.filterMode === 'nonpaye' ? this.api.getLoyerNonPaye()
      : this.api.getAllBoutiques();

    call.subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  setFilter(f: FilterMode) {
    this.filterMode = f;
    this.load();
  }

  openAdd() {
    this.form = { ouverture: '09:00', fermeture: '18:00' };
    this.isEdit = false;
    this.formError = '';
    this.showModal = true;
  }

  openEdit(b: any) {
    this.form = { ...b };
    this.isEdit = true;
    this.formError = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.form.libelle) { this.formError = 'Le libellé est requis.'; return; }
    this.saving = true;
    this.formError = '';
    const obs = this.isEdit
      ? this.api.updateBoutique(this.form._id, this.form)
      : this.api.createBoutique(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.error || e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(b: any) {
    if (!confirm(`Supprimer la boutique "${b.libelle}" ?`)) return;
    this.api.deleteBoutique(b._id).subscribe({
      next: () => this.load(),
      error: e => this.error = e.error?.message || 'Erreur suppression'
    });
  }

  isOpenNow(b: any): boolean {
    const now = new Date().toTimeString().slice(0, 5);
    return b.ouverture <= now && now <= b.fermeture;
  }
}
