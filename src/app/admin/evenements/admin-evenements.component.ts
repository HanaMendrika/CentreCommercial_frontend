import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-evenements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-evenements.component.html',
})
export class AdminEvenementsComponent implements OnInit {
  items: any[] = [];
  loading = false;
  error = '';

  filterActives = false;
  filterBoutique = '';

  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  constructor(private api: AdminApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.error = '';
    const params: any = {};
    if (this.filterActives) params.dateActives = 'true';
    if (this.filterBoutique.trim()) params.idBoutique = this.filterBoutique.trim();

    this.api.getAllEvenements(params).subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  openAdd() {
    this.form = { idStatus: 'ACTIF' };
    this.isEdit = false;
    this.formError = '';
    this.showModal = true;
  }

  openEdit(ev: any) {
    this.form = {
      ...ev,
      dateDebut: ev.dateDebut ? ev.dateDebut.substring(0, 10) : '',
      dateFin: ev.dateFin ? ev.dateFin.substring(0, 10) : '',
    };
    this.isEdit = true;
    this.formError = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.form.libelle || !this.form.dateDebut || !this.form.dateFin || !this.form.cible) {
      this.formError = 'Libellé, dates et cible sont requis.';
      return;
    }
    this.saving = true;
    this.formError = '';
    const obs = this.isEdit
      ? this.api.updateEvenement(this.form._id, this.form)
      : this.api.createEvenement(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.error || e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  isActive(ev: any): boolean {
    const now = new Date();
    return new Date(ev.dateDebut) <= now && now <= new Date(ev.dateFin);
  }
}
