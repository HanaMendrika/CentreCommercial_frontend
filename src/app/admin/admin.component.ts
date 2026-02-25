import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <div style="padding:40px; color:#fff; background:#1a1a2e; min-height:100vh;">
      <h2>Dashboard Admin</h2>
      <p>Bienvenue, {{ user?.matricule }}</p>
      <button (click)="logout()" style="padding:8px 16px; background:#e94560; color:#fff; border:none; border-radius:8px; cursor:pointer;">
        Déconnexion
      </button>
    </div>
  `
})
export class AdminComponent {
  user: any;

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
