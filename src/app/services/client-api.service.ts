import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClientAuthService } from './client-auth.service';
import { environment } from '../../environnements/environment';

@Injectable({ providedIn: 'root' })
export class ClientApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient, private auth: ClientAuthService) {}

  private get authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  // ── Boutiques ────────────────────────────────────────────
  getBoutiques(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques`, { params });
  }
  getBoutiqueById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/boutiques/${id}`);
  }
  getBoutiquesOpen(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques/open`);
  }
  getBoutiquesAgenda(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques/agenda`);
  }
  getBoutiqueHoraire(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/boutiques/${id}/horaire`);
  }
  getBoutiquesFoodcourt(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques/foodcourt`);
  }
  getFoodcourtBoutiqueById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/boutiques/foodcourt/${id}`);
  }
  getAllProduits(limit = 12): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/produits?limit=${limit}`);
  }
  getBoutiqueProduits(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques/${id}/produits`);
  }
  getBoutiquesWithStatus(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/boutiques/plan`);
  }
  getParking(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/parking`);
  }
  getParkingStats(): Observable<any> {
    return this.http.get<any>(`${this.base}/api/parking/stats`);
  }

  // ── Promotions ───────────────────────────────────────────
  getPromotions(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/promotions`, { params });
  }
  getPromotionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/promotions/${id}`);
  }
  getPromotionsUpcoming(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/promotions/upcoming`);
  }

  // ── Commandes ────────────────────────────────────────────
  passerCommande(data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/commandes`, data, { headers: this.authHeaders });
  }
  getMesCommandes(clientId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/clients/${clientId}/commandes`, { headers: this.authHeaders });
  }
  getCommandeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/commandes/${id}`, { headers: this.authHeaders });
  }
  annulerCommande(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/commandes/${id}`, { headers: this.authHeaders });
  }

  // ── Avis ─────────────────────────────────────────────────
  getAvis(produitId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/api/produits/${produitId}/avis`);
  }
  addAvis(produitId: string, data: { note: number; commentaire: string }): Observable<any> {
    return this.http.post<any>(`${this.base}/api/produits/${produitId}/avis`, data, { headers: this.authHeaders });
  }
  updateAvis(avisId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/avis/${avisId}`, data, { headers: this.authHeaders });
  }
  deleteAvis(avisId: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/avis/${avisId}`, { headers: this.authHeaders });
  }

  // ── Profil client ─────────────────────────────────────────
  getProfil(clientId: string): Observable<any> {
    return this.http.get<any>(`${this.base}/api/clients/${clientId}`, { headers: this.authHeaders });
  }
  updateProfil(clientId: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/clients/${clientId}`, data, { headers: this.authHeaders });
  }
  deleteAccount(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/clients/${clientId}`, { headers: this.authHeaders });
  }

  commanderEtPayer(idBoutique: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/commandes/boutique/${idBoutique}/commander-payer`, data, { headers: this.authHeaders });
  }
}