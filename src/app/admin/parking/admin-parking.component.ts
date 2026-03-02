import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminApiService } from '../../services/admin-api.service';

@Component({
  selector: 'app-admin-parking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-parking.component.html',
})
export class AdminParkingComponent implements OnInit {
  items: any[] = [];
  parkings: any[] = [];
  acheteurs: any[] = [];
  loading = false;
  error = '';

  filterParking = '';
  filterReservateur = '';

  showModal = false;
  isEdit = false;
  form: any = {};
  formError = '';
  saving = false;

  constructor(private api: AdminApiService, private http: HttpClient) {}

  ngOnInit() {
    this.loadParkings();
    this.loadAcheteurs();
    this.load();
  }

  loadParkings() {
    this.http.get<any[]>('/api/admin/parking').subscribe({
      next: d => this.parkings = Array.isArray(d) ? d : [],
      error: () => {}
    });
  }

  loadAcheteurs() {
    this.http.get<any[]>('/api/admin/dashboard/clients/all').subscribe({
      next: d => this.acheteurs = Array.isArray(d) ? d : [],
      error: () => {}
    });
  }

  load() {
    this.loading = true;
    this.error = '';
    const params: any = {};
    if (this.filterParking) params.idParking = this.filterParking;
    if (this.filterReservateur) params.reservateur = this.filterReservateur;

    this.api.getAllReservations(params).subscribe({
      next: d => { this.items = Array.isArray(d) ? d : []; this.loading = false; },
      error: e => { this.error = e.error?.message || 'Erreur de chargement'; this.loading = false; }
    });
  }

  openAdd() {
    this.form = { idStatus: 'CONFIRME', idparking: this.parkings[0]?.idParking || '' };
    this.isEdit = false;
    this.formError = '';
    this.showModal = true;
  }

  openEdit(r: any) {
    this.form = { ...r };
    this.isEdit = true;
    this.formError = '';
    this.showModal = true;
  }

  close() { this.showModal = false; }

  save() {
    if (!this.form.idparking || !this.form.reservateur) {
      this.formError = 'Parking et réservateur sont requis.';
      return;
    }
    this.saving = true;
    this.formError = '';
    const obs = this.isEdit
      ? this.api.updateReservation(this.form._id, this.form)
      : this.api.createReservation(this.form);
    obs.subscribe({
      next: () => { this.saving = false; this.close(); this.load(); },
      error: e => { this.formError = e.error?.error || e.error?.message || 'Erreur'; this.saving = false; }
    });
  }

  delete(r: any) {
    if (!confirm('Supprimer cette réservation ?')) return;
    this.api.deleteReservation(r._id).subscribe({
      next: () => this.load(),
      error: e => this.error = e.error?.message || 'Erreur suppression'
    });
  }

  resetFilters() {
    this.filterParking = '';
    this.filterReservateur = '';
    this.load();
  }

  countByStatus(status: string): number {
    return this.items.filter(r => r.idStatus === status).length;
  }

  parkingLibelle(idParking: string): string {
    return this.parkings.find(p => p.idParking === idParking)?.libelle || idParking;
  }

  acheteurNom(idAcheteur: string): string {
    return this.acheteurs.find(a => a.idAcheteur === idAcheteur)?.nom || idAcheteur;
  }
}
