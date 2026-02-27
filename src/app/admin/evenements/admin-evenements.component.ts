import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-evenements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-evenements.component.html',
})
export class AdminEvenementsComponent implements OnInit {
  allItems: any[] = [];
  items: any[] = [];
  participations: any[] = [];
  boutiques: any[] = [];
  loading = false;
  error = '';

  filterActives = false;
  filterBoutique = '';

  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  constructor(private api: AdminApiService, private http: HttpClient) {}

  ngOnInit() {
    this.api.getAllBoutiques().subscribe({ next: d => this.boutiques = Array.isArray(d) ? d : [], error: () => {} });
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.error = '';
    this.api.getAllEvenements().subscribe({
      next: d => {
        this.allItems = Array.isArray(d) ? d : [];
        this.http.get<any[]>('/api/admin/evenement/participations').subscribe({
          next: p => { this.participations = Array.isArray(p) ? p : []; this.applyFilter(); this.loading = false; },
          error: () => { this.applyFilter(); this.loading = false; }
        });
      },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  applyFilter() {
    let result = [...this.allItems];

    if (this.filterBoutique) {
      const linkedIds = this.participations
        .filter(p => p.idboutique === this.filterBoutique)
        .map(p => p.idevenement);
      result = result.filter(ev => linkedIds.includes(ev.idevenement));
    }

    if (this.filterActives) {
      const now = new Date();
      result = result.filter(ev => new Date(ev.dateDebut) <= now && now <= new Date(ev.dateFin));
    }

    this.items = result;
  }

  load() { this.applyFilter(); }

  boutiquesOf(ev: any): string[] {
    return this.participations
      .filter(p => p.idevenement === ev.idevenement)
      .map(p => {
        const b = this.boutiques.find(x => x.idboutique === p.idboutique);
        return b ? b.libelle : p.idboutique;
      });
  }

  openAdd() {
    this.form = { idStatus: 'STA008' };
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
      next: () => { this.saving = false; this.close(); this.loadAll(); },
      error: e => { this.formError = e.error?.error || e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  isActive(ev: any): boolean {
    const now = new Date();
    return new Date(ev.dateDebut) <= now && now <= new Date(ev.dateFin);
  }
}
