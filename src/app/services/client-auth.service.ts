import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment'

export interface ClientUser {
  id: string;
  nom: string;
  mail: string;
  contact?: string;
  adresse?: string;
}

@Injectable({ providedIn: 'root' })
export class ClientAuthService {
  private base = environment.apiUrl;
  private readonly KEY_TOKEN  = 'cc_client_token';
  private readonly KEY_CLIENT = 'cc_client_user';

  constructor(private http: HttpClient) {}

  register(data: { nom: string; mail: string; mdp: string; contact: string; adresse: string }): Observable<any> {
    return this.http.post(`${this.base}/api/auth/client/register`, data);
  }

  login(mail: string, mdp: string): Observable<any> {
    return this.http.post<any>(`${this.base}/api/auth/client/login`, { mail, mdp }).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.KEY_TOKEN, res.token);
          try {
            const payload = JSON.parse(atob(res.token.split('.')[1]));
            const user: ClientUser = { id: payload.id, nom: res.nom || mail.split('@')[0], mail };
            localStorage.setItem(this.KEY_CLIENT, JSON.stringify(user));
          } catch {}
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.base}/api/auth/client/logout`, {}).pipe(
      tap(() => this.clear())
    );
  }

  isLoggedIn(): boolean { return !!this.getToken(); }
  getToken(): string | null { return localStorage.getItem(this.KEY_TOKEN); }

  getClient(): ClientUser | null {
    const d = localStorage.getItem(this.KEY_CLIENT);
    return d ? JSON.parse(d) : null;
  }

  updateLocalClient(data: Partial<ClientUser>): void {
    const current = this.getClient();
    if (current) localStorage.setItem(this.KEY_CLIENT, JSON.stringify({ ...current, ...data }));
  }

  clear(): void {
    localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_CLIENT);
  }
}