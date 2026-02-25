// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,  // Déjà présent normalement
  imports: [CommonModule],  // Importer les modules nécessaires
  template: `
    <div style="padding: 20px;">
      <h2>Test de connexion au backend</h2>
      
      <button (click)="testBackend()" [disabled]="loading">
        {{ loading ? 'Test en cours...' : 'Tester la connexion' }}
      </button>
      
      <div *ngIf="response" style="margin-top: 20px;">
        <h3>Réponse du serveur :</h3>
        <pre>{{ response | json }}</pre>
      </div>
      
      <div *ngIf="error" style="color: red; margin-top: 20px;">
        <h3>Erreur :</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  response: any = null;
  error: string | null = null;
  loading = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.testBackend();
  }

  testBackend() {
    this.loading = true;
    this.error = null;
    
    this.http.get('/api/boutiques').subscribe({
      next: (data) => {
        this.response = data;
        this.loading = false;
        console.log('Connexion réussie!', data);
      },
      error: (err) => {
        this.error = err.message || 'Erreur de connexion au backend';
        this.loading = false;
        console.error('Erreur de connexion:', err);
      }
    });
  }
}