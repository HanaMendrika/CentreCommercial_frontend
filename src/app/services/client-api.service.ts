import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientAuthService } from './client-auth.service';

@Injectable({ providedIn: 'root' })
export class ClientApiService {

  constructor(private http: HttpClient, private auth: ClientAuthService) {}

  private get authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // ── Boutiques ────────────────────────────────────────────
  getBoutiques(params?: any): Observable<any[]> {
    return this.http.get<any[]>('/api/boutiques', { params });
  }
  getBoutiqueById(id: string): Observable<any> {
    return this.http.get<any>(`/api/boutiques/${id}`);
  }
  getBoutiquesOpen(): Observable<any[]> {
    return this.http.get<any[]>('/api/boutiques/open');
  }
  getBoutiquesAgenda(): Observable<any[]> {
    return this.http.get<any[]>('/api/boutiques/agenda');
  }
  getBoutiqueHoraire(id: string): Observable<any> {
    return this.http.get<any>(`/api/boutiques/${id}/horaire`);
  }
  getBoutiquesFoodcourt(): Observable<any[]> {
    return this.http.get<any[]>('/api/boutiques/foodcourt');
  }
  getFoodcourtBoutiqueById(id: string): Observable<any> {
    return this.http.get<any>(`/api/boutiques/foodcourt/${id}`);
  }
  getAllProduits(limit = 12): Observable<any[]> {
    return this.http.get<any[]>(`/api/produits?limit=${limit}`);
  }
  getBoutiqueProduits(id: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/boutiques/${id}/produits`);
  }
  getBoutiquesWithStatus(): Observable<any[]> {
    return this.http.get<any[]>('/api/boutiques/plan');
  }
  getParking(): Observable<any[]> {
    return this.http.get<any[]>('/api/parking');
  }
  getParkingStats(): Observable<any> {
    return this.http.get<any>('/api/parking/stats');
  }

  // ── Promotions ───────────────────────────────────────────
  getPromotions(params?: any): Observable<any[]> {
    return this.http.get<any[]>('/api/promotions', { params });
  }
  getPromotionById(id: string): Observable<any> {
    return this.http.get<any>(`/api/promotions/${id}`);
  }
  getPromotionsUpcoming(): Observable<any[]> {
    return this.http.get<any[]>('/api/promotions/upcoming');
  }

  // ── Commandes ────────────────────────────────────────────
  passerCommande(data: any): Observable<any> {
    return this.http.post<any>('/api/commandes', data, { headers: this.authHeaders });
  }
  getMesCommandes(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/clients/${clientId}/commandes`, { headers: this.authHeaders });
  }
  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`/api/commandes/${id}`, { headers: this.authHeaders });
  }
  annulerCommande(id: string): Observable<any> {
    return this.http.delete<any>(`/api/commandes/${id}`, { headers: this.authHeaders });
  }

  // ── Avis ─────────────────────────────────────────────────
  getAvis(produitId: string): Observable<any[]> {
    return this.http.get<any[]>(`/api/produits/${produitId}/avis`);
  }
  addAvis(produitId: string, data: { note: number; commentaire: string }): Observable<any> {
    return this.http.post<any>(`/api/produits/${produitId}/avis`, data, { headers: this.authHeaders });
  }
  updateAvis(avisId: string, data: any): Observable<any> {
    return this.http.put<any>(`/api/avis/${avisId}`, data, { headers: this.authHeaders });
  }
  deleteAvis(avisId: string): Observable<any> {
    return this.http.delete<any>(`/api/avis/${avisId}`, { headers: this.authHeaders });
  }

  // ── Profil client ─────────────────────────────────────────
  getProfil(clientId: string): Observable<any> {
    return this.http.get<any>(`/api/clients/${clientId}`, { headers: this.authHeaders });
  }
  updateProfil(clientId: string, data: any): Observable<any> {
    return this.http.put<any>(`/api/clients/${clientId}`, data, { headers: this.authHeaders });
  }
  deleteAccount(clientId: string): Observable<any> {
    return this.http.delete<any>(`/api/clients/${clientId}`, { headers: this.authHeaders });
  }
}
