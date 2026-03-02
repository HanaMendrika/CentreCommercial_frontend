import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

const NAV = [
  { label: 'Tableau de bord', icon: '/icons/dashboard.png',  path: 'dashboard'  },
  { label: 'Boutiques',       icon: '/icons/produits.png',   path: 'boutiques'  },
  { label: 'Événements',      icon: '/icons/promotion.png',  path: 'evenements' },
  { label: 'Emplacements',    icon: '/icons/loyer.png',      path: 'boxes'      },
  { label: 'Parking',         icon: '/icons/commandes.png',  path: 'parking'    },
];

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  nav = NAV;
  user: any;
  initiale = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.initiale = (this.user?.matricule?.[0] || 'A').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
