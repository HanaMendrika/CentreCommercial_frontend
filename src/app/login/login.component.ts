import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
          this.router.navigate(['/boutiques']);
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