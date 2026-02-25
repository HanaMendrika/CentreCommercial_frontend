import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 48px 40px;
      backdrop-filter: blur(12px);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.4);
    }

    .brand-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #e94560, #c0392b);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 28px;
    }

    .brand-title {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .brand-subtitle {
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.85rem;
      text-align: center;
      margin-bottom: 36px;
    }

    .form-label {
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .form-control {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: #ffffff;
      padding: 12px 16px;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .form-control:focus {
      background: rgba(255, 255, 255, 0.1);
      border-color: #e94560;
      box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.15);
      color: #ffffff;
      outline: none;
    }

    .form-control::placeholder {
      color: rgba(255, 255, 255, 0.25);
    }

    .btn-login {
      width: 100%;
      padding: 13px;
      background: linear-gradient(135deg, #e94560, #c0392b);
      border: none;
      border-radius: 10px;
      color: #ffffff;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(233, 69, 96, 0.4);
    }

    .btn-login:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-login:disabled {
      opacity: 0.65;
      cursor: not-allowed;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .alert-error {
      background: rgba(233, 69, 96, 0.15);
      border: 1px solid rgba(233, 69, 96, 0.4);
      border-radius: 10px;
      color: #ff8fa3;
      padding: 12px 16px;
      font-size: 0.875rem;
      margin-bottom: 20px;
    }
  `],
  template: `
    <div class="login-card">
      <div class="brand-icon">🏬</div>
      <h1 class="brand-title">Centre Commercial</h1>
      <p class="brand-subtitle">Espace de gestion</p>

      <div *ngIf="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
        <div class="mb-3">
          <label class="form-label">Matricule</label>
          <input
            type="text"
            class="form-control"
            [(ngModel)]="matricule"
            name="matricule"
            placeholder="Entrez votre matricule"
            required
            autocomplete="username"
          />
        </div>

        <div class="mb-4">
          <label class="form-label">Mot de passe</label>
          <input
            type="password"
            class="form-control"
            [(ngModel)]="mdp"
            name="mdp"
            placeholder="Entrez votre mot de passe"
            required
            autocomplete="current-password"
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          [disabled]="loading || !matricule || !mdp"
        >
          <span *ngIf="loading" class="spinner"></span>
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>
    </div>
  `
})
export class LoginComponent {
  matricule = '';
  mdp = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.matricule || !this.mdp) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.matricule, this.mdp).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (response.role === 'BOUTIQUE') {
          this.router.navigate(['/boutique']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 0) {
          this.errorMessage = 'Serveur inaccessible — vérifiez que le backend est démarré (port 5000).';
        } else {
          this.errorMessage = err.error?.message || 'Matricule ou mot de passe incorrect.';
        }
      }
    });
  }
}
