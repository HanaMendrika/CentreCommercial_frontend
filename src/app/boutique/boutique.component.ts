import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

const NAV = [
  { label: 'Dashboard',  icon: '/icons/dashboard.png', path: 'dashboard'  },
  { label: 'Produits',   icon: '/icons/produits.png', path: 'produits'   },
  { label: 'Profil',     icon: '/icons/profils.png', path: 'profil'     },
  { label: 'Clients',    icon: '/icons/client.png', path: 'clients'    },
  { label: 'Loyer',      icon: '/icons/loyer.png', path: 'loyer'      },
  { label: 'Promotions', icon: '/icons/promotion.png', path: 'promotions' },
  { label: 'Ventes',     icon: '/icons/vente.png', path: 'ventes'     },
  { label: 'Employés',   icon: '/icons/employer.png', path: 'employes'   },
  { label: 'Commandes',  icon: '/icons/commandes.png', path: 'commandes'  },
];

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './boutique.component.html',
  styleUrls: ['./boutique.component.css']
})
export class BoutiqueComponent {
  nav = NAV;
  user: any;
  initiale = '';

  constructor(private authService: AuthService, private router: Router) {
    this.user = this.authService.getUser();
    this.initiale = (this.user?.matricule?.[0] || 'B').toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}