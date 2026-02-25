import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';

const NAV = [
  { label: 'Dashboard',  icon: '⊞', path: 'dashboard'  },
  { label: 'Produits',   icon: '📦', path: 'produits'   },
  { label: 'Profil',     icon: '🏪', path: 'profil'     },
  { label: 'Clients',    icon: '👥', path: 'clients'    },
  { label: 'Loyer',      icon: '💰', path: 'loyer'      },
  { label: 'Promotions', icon: '🎁', path: 'promotions' },
  { label: 'Ventes',     icon: '📊', path: 'ventes'     },
  { label: 'Employés',   icon: '👤', path: 'employes'   },
  { label: 'Commandes',  icon: '📋', path: 'commandes'  },
];

@Component({
  selector: 'app-boutique',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styles: [`
    :host { display: flex; height: 100vh; overflow: hidden; }

    .sidebar {
      width: 230px; min-width: 230px; background: var(--cc-sidebar);
      border-right: 1px solid var(--cc-border);
      display: flex; flex-direction: column; height: 100vh; overflow-y: auto;
    }

    .brand {
      padding: 24px 20px 20px;
      border-bottom: 1px solid var(--cc-border);
    }
    .brand-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, var(--cc-accent), var(--cc-accent2));
      border-radius: 10px; display: flex; align-items: center; justify-content: center;
      font-size: 18px; margin-bottom: 10px;
    }
    .brand-name { color: #fff; font-weight: 700; font-size: 0.95rem; margin: 0; }
    .brand-sub  { color: var(--cc-muted); font-size: 0.75rem; margin: 2px 0 0; }

    nav { flex: 1; padding: 12px 10px; }

    .nav-link {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: 10px; margin-bottom: 2px;
      color: var(--cc-muted); font-size: 0.875rem; font-weight: 500;
      text-decoration: none; transition: all 0.18s; cursor: pointer;
    }
    .nav-link:hover { background: rgba(255,255,255,.06); color: var(--cc-text); }
    .nav-link.active { background: rgba(233,69,96,.12); color: var(--cc-accent); }
    .nav-icon { font-size: 1rem; width: 22px; text-align: center; }

    .sidebar-footer {
      padding: 16px 10px;
      border-top: 1px solid var(--cc-border);
    }
    .user-row {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .user-avatar {
      width: 32px; height: 32px;
      background: linear-gradient(135deg, var(--cc-accent), var(--cc-accent2));
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .user-name  { color: var(--cc-text); font-size: 0.82rem; font-weight: 600; }
    .user-role  { color: var(--cc-muted); font-size: 0.72rem; }
    .btn-logout {
      width: 100%; padding: 9px 12px; background: rgba(233,69,96,.1);
      border: 1px solid rgba(233,69,96,.2); border-radius: 10px;
      color: #e94560; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all .2s;
    }
    .btn-logout:hover { background: rgba(233,69,96,.2); }

    .main { flex: 1; overflow-y: auto; background: var(--cc-bg); }
  `],
  template: `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-icon">🏬</div>
        <p class="brand-name">Centre Commercial</p>
        <p class="brand-sub">Espace boutique</p>
      </div>

      <nav>
        @for (item of nav; track item.path) {
          <a class="nav-link"
             [routerLink]="['/boutique', item.path]"
             routerLinkActive="active">
            <span class="nav-icon">{{ item.icon }}</span>
            {{ item.label }}
          </a>
        }
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="user-avatar">{{ initiale }}</div>
          <div>
            <div class="user-name">{{ user?.matricule }}</div>
            <div class="user-role">Boutique</div>
          </div>
        </div>
        <button class="btn-logout" (click)="logout()">↩ Déconnexion</button>
      </div>
    </aside>

    <main class="main">
      <router-outlet />
    </main>
  `
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
