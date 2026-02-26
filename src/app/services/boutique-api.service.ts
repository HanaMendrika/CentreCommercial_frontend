import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BoutiqueApiService {

  constructor(private http: HttpClient, private auth: AuthService) {}

  get idBoutique(): string {
    return this.auth.getUser()?.matricule || '';
  }

  private genId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 9000) + 1000}`;
  }

  // ── Profil ──────────────────────────────────────────────
  getProfil(): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}`);
  }
  updateProfil(data: any): Observable<any> {
    return this.http.put(`/api/boutiques/${this.idBoutique}`, data);
  }

  // ── Produits ─────────────────────────────────────────────
  getProduits(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/produits`, { params: filters });
  }
  addProduit(data: any): Observable<any> {
    return this.http.post(`/api/boutiques/${this.idBoutique}/produits`, {
      ...data,
      idProduit: this.genId('PROD')
    });
  }
  updateProduit(idProduit: string, data: any): Observable<any> {
    return this.http.put(`/api/produits/${idProduit}`, data);
  }
  deleteProduit(idProduit: string): Observable<any> {
    return this.http.delete(`/api/produits/${idProduit}`);
  }

  // ── Clients ──────────────────────────────────────────────
  getClients(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/clients`, { params: filters });
  }
  getTopClients(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/clients/top`, { params: filters });
  }
  getClientById(idClient: string): Observable<any> {
    return this.http.get(`/api/clients/${idClient}`);
  }

  // ── Loyer ────────────────────────────────────────────────
  getLoyers(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/loyer`, { params: filters });
  }
  addLoyer(data: any): Observable<any> {
    return this.http.post(`/api/boutiques/${this.idBoutique}/loyer`, {
      ...data,
      idLoyer: this.genId('LOYER')
    });
  }
  updateLoyer(idLoyer: string, data: any): Observable<any> {
    return this.http.put(`/api/loyer/${idLoyer}`, data);
  }
  deleteLoyer(idLoyer: string): Observable<any> {
    return this.http.delete(`/api/loyer/${idLoyer}`);
  }

  // ── Promotions ───────────────────────────────────────────
  getPromotions(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/promotions`, { params: filters });
  }
  createPromotion(data: any): Observable<any> {
    return this.http.post('/api/promotions', {
      ...data,
      idBoutiques: [this.idBoutique]
    });
  }
  updatePromotion(id: string, data: any): Observable<any> {
    return this.http.put(`/api/promotions/${id}`, data);
  }
  deletePromotion(id: string): Observable<any> {
    return this.http.delete(`/api/promotions/${id}`);
  }

  // ── Ventes ───────────────────────────────────────────────
  getVentes(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/ventes`, { params: filters });
  }
  getVentesStats(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/ventes/stats`, { params: filters });
  }

  // ── Employés ─────────────────────────────────────────────
  getEmployes(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/employes`, { params: filters });
  }
  addEmploye(data: any): Observable<any> {
    return this.http.post(`/api/boutiques/${this.idBoutique}/employes`, {
      ...data,
      idEmploye: this.genId('EMP')
    });
  }
  updateEmploye(idEmploye: string, data: any): Observable<any> {
    return this.http.put(`/api/employes/${idEmploye}`, data);
  }
  deleteEmploye(idEmploye: string): Observable<any> {
    return this.http.delete(`/api/employes/${idEmploye}`);
  }

  // ── Commandes ────────────────────────────────────────────
  getCommandes(filters?: any): Observable<any> {
    return this.http.get(`/api/boutiques/${this.idBoutique}/commandes`, { params: filters });
  }
  createCommande(data: any): Observable<any> {
    const id = this.genId('CMD');
    return this.http.post(`/api/boutiques/${this.idBoutique}/commandes`, {
      ...data,
      idcommande: id,
      numero_commande: `N-${id}`
    });
  }
  updateCommande(idCommande: string, data: any): Observable<any> {
    return this.http.put(`/api/commandes/${idCommande}`, data);
  }
  deleteCommande(idCommande: string): Observable<any> {
    return this.http.delete(`/api/commandes/${idCommande}`);
  }
}
