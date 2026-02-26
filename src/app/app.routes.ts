import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { BoutiqueComponent } from './boutique/boutique.component';
import { DashboardComponent } from './boutique/dashboard/dashboard.component';
import { ProduitsComponent } from './boutique/produits/produits.component';
import { ProfilComponent } from './boutique/profil/profil.component';
import { ClientsComponent } from './boutique/clients/clients.component';
import { LoyerComponent } from './boutique/loyer/loyer.component';
import { PromotionsComponent } from './boutique/promotions/promotions.component';
import { VentesComponent } from './boutique/ventes/ventes.component';
import { EmployesComponent } from './boutique/employes/employes.component';
import { CommandesComponent } from './boutique/commandes/commandes.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent },
  {
    path: 'boutique',
    component: BoutiqueComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: DashboardComponent  },
      { path: 'produits',   component: ProduitsComponent   },
      { path: 'profil',     component: ProfilComponent     },
      { path: 'clients',    component: ClientsComponent    },
      { path: 'loyer',      component: LoyerComponent      },
      { path: 'promotions', component: PromotionsComponent },
      { path: 'ventes',     component: VentesComponent     },
      { path: 'employes',   component: EmployesComponent   },
      { path: 'commandes',  component: CommandesComponent  },
    ]
  },
  { path: '**', redirectTo: 'login' }
];
