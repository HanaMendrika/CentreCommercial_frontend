import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnements/environment';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Dashboard ─────────────────────────────────────────────
  getTotalClients(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/clients/count`);
  }
  getClientsByFilter(params?: any): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/clients`, { params });
  }
  getTopBuyers(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/clients/top-buyers`);
  }
  getTopSpenders(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/clients/top-spenders`);
  }
  getClientHistory(idAcheteur: string): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/clients/${idAcheteur}/history`);
  }
  getTopBoutiques(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/boutiques/top-sales`);
  }
  getSalesByBoutique(idBoutique: string): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/boutiques/${idBoutique}/sales`);
  }
  getTopProducts(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/products/top-sales`);
  }
  getSalesByPeriod(params?: any): Observable<any> {
    return this.http.get(`${this.base}/api/admin/dashboard/sales`, { params });
  }

  // ── Boutiques ─────────────────────────────────────────────
  getAllBoutiques(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique`);
  }
  createBoutique(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/admin/boutique`, data);
  }
  updateBoutique(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/admin/boutique/${id}`, data);
  }
  deleteBoutique(id: string): Observable<any> {
    return this.http.delete(`${this.base}/api/admin/boutique/${id}`);
  }
  getOpenBoutiques(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique/open`);
  }
  getClosedBoutiques(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique/closed`);
  }
  getBoutiquesByCategorie(idCategorie: number): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique/categorie/${idCategorie}`);
  }
  getLoyerPaye(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique/loyer/paye`);
  }
  getLoyerNonPaye(): Observable<any> {
    return this.http.get(`${this.base}/api/admin/boutique/loyer/non-paye`);
  }

  // ── Événements ───────────────────────────────────────────
  getAllEvenements(params?: any): Observable<any> {
    return this.http.get(`${this.base}/api/admin/evenement`, { params });
  }
  createEvenement(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/admin/evenement`, data);
  }
  getEvenementById(id: string): Observable<any> {
    return this.http.get(`${this.base}/api/admin/evenement/${id}`);
  }
  updateEvenement(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/admin/evenement/${id}`, data);
  }

  // ── Emplacements (Boxes) ─────────────────────────────────
  getAllBoxes(params?: any): Observable<any> {
    return this.http.get(`${this.base}/api/admin/box`, { params });
  }
  createBox(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/admin/box`, data);
  }
  getBoxById(id: string): Observable<any> {
    return this.http.get(`${this.base}/api/admin/box/${id}`);
  }
  updateBox(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/admin/box/${id}`, data);
  }

  // ── Parking Réservations ─────────────────────────────────
  getAllReservations(params?: any): Observable<any> {
    return this.http.get(`${this.base}/api/admin/parking/reservations`, { params });
  }
  createReservation(data: any): Observable<any> {
    return this.http.post(`${this.base}/api/admin/parking/reservations`, data);
  }
  getReservationById(id: string): Observable<any> {
    return this.http.get(`${this.base}/api/admin/parking/reservations/${id}`);
  }
  updateReservation(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/api/admin/parking/reservations/${id}`, data);
  }
  deleteReservation(id: string): Observable<any> {
    return this.http.delete(`${this.base}/api/admin/parking/reservations/${id}`);
  }
}