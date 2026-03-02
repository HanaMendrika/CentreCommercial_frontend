import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientAuthService } from '../../services/client-auth.service';

@Component({
  selector: 'app-login-client',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.css']
})
export class LoginClientComponent {
  mail     = '';
  mdp      = '';
  loading  = false;
  error    = '';

  constructor(private auth: ClientAuthService, private router: Router, private route: ActivatedRoute) {}

  submit(): void {
    if (!this.mail || !this.mdp) { this.error = 'Veuillez remplir tous les champs'; return; }
    this.loading = true; this.error = '';
    this.auth.login(this.mail, this.mdp).subscribe({
      next: () => {
        this.loading = false;
        const next = this.route.snapshot.queryParamMap.get('next') || '/';
        this.router.navigateByUrl(next);
      },
      error: (e) => {
        this.loading = false;
        this.error = e.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}
