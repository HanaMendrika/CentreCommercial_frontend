import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientAuthService } from '../../services/client-auth.service';
import { AppIconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AppIconComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = { nom: '', mail: '', mdp: '', mdpConfirm: '', contact: '', adresse: '' };
  loading = false;
  error   = '';
  success = false;

  constructor(private auth: ClientAuthService, private router: Router) {}

  submit(): void {
    if (!this.form.nom || !this.form.mail || !this.form.mdp || !this.form.contact || !this.form.adresse) {
      this.error = 'Veuillez remplir tous les champs'; return;
    }
    if (this.form.mdp !== this.form.mdpConfirm) {
      this.error = 'Les mots de passe ne correspondent pas'; return;
    }
    this.loading = true; this.error = '';
    const { mdpConfirm, ...data } = this.form;
    this.auth.register(data).subscribe({
      next: () => {
        this.loading = false; this.success = true;
        setTimeout(() => this.router.navigate(['/client/login']), 2000);
      },
      error: (e) => { this.loading = false; this.error = e.error?.message || 'Erreur lors de l\'inscription'; }
    });
  }
}
