import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-boxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-boxes.component.html',
})
export class AdminBoxesComponent implements OnInit {
  items: any[] = [];
  allItems: any[] = [];
  loading = false;
  error = '';

  filterDisponible: '' | 'true' | 'false' = '';

  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  constructor(private api: AdminApiService) {}

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.loading = true;
    this.error = '';
    this.api.getAllBoxes().subscribe({
      next: d => {
        this.allItems = Array.isArray(d) ? d : [];
        this.applyFilter();
        this.loading = false;
      },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  load() {
    if (this.filterDisponible === '') {
      this.items = [...this.allItems];
    } else {
      const dispo = this.filterDisponible === 'true';
      this.items = this.allItems.filter(b => b.disponible === dispo);
    }
  }

  applyFilter() { this.load(); }

  get countDisponible(): number { return this.allItems.filter(b => b.disponible).length; }
  get countOccupe(): number { return this.allItems.filter(b => !b.disponible).length; }

  get zones(): string[] {
    const set = new Set<string>(this.items.map(b => b.zone || 'Sans zone'));
    return Array.from(set);
  }

  itemsByZone(zone: string): any[] {
    return this.items.filter(b => (b.zone || 'Sans zone') === zone);
  }

  openAdd() {
    this.form = { disponible: true, zone: 'RDC' };
    this.isEdit = false;
    this.formError = '';
    this.showModal = true;
  }

  openEdit(box: any) {
    this.form = { ...box };
    this.isEdit = true;
    this.formError = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.isEdit && !this.form.numero) { this.formError = 'Le numéro est requis.'; return; }
    this.saving = true;
    this.formError = '';
    const payload = this.isEdit
      ? { zone: this.form.zone, disponible: this.form.disponible }
      : this.form;
    const obs = this.isEdit
      ? this.api.updateBox(this.form._id, payload)
      : this.api.createBox(payload);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.loadAll(); },
      error: e => { this.formError = e.error?.error || e.error?.message || 'Erreur'; this.saving = false; }
    });
  }
}
