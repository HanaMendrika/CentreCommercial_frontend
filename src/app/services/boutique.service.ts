// src/app/services/boutique.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = '/api/boutique'; // Le proxy redirigera vers localhost:5000

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`); // Si vous avez un endpoint /test
  }
}