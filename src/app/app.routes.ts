import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AdminDashboardComponent } from './admin/dashboard/admin-dashboard.component';
import { AdminBoutiquesComponent } from './admin/boutiques/admin-boutiques.component';
import { AdminEvenementsComponent } from './admin/evenements/admin-evenements.component';
import { AdminBoxesComponent } from './admin/boxes/admin-boxes.component';
import { AdminParkingComponent } from './admin/parking/admin-parking.component';
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

// ── Section client ────────────────────────────────────────
import { LayoutComponent } from './client/layout/layout.component';
import { AccueilComponent } from './client/accueil/accueil.component';
import { AgendaComponent } from './client/agenda/agenda.component';
import { BoutiquesComponent } from './client/boutiques/boutiques.component';
import { BoutiqueDetailComponent } from './client/boutique-detail/boutique-detail.component';
import { FoodcourtComponent } from './client/foodcourt/foodcourt.component';
import { ProfilClientComponent } from './client/profil/profil.component';
import { CommandesClientComponent } from './client/commandes/commandes.component';
import { LoginClientComponent } from './client/login/login-client.component';
import { RegisterComponent } from './client/register/register.component';
import { PlanComponent } from './client/plan/plan.component';
import { clientAuthGuard } from './guards/client-auth.guard';

export const routes: Routes = [
  // ── Login partagé boutique + admin ─────────────────────
  { path: 'login', component: LoginComponent },

  // ── Section admin ───────────────────────────────────────
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '',           redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard',  component: AdminDashboardComponent  },
      { path: 'boutiques',  component: AdminBoutiquesComponent  },
      { path: 'evenements', component: AdminEvenementsComponent },
      { path: 'boxes',      component: AdminBoxesComponent      },
      { path: 'parking',    component: AdminParkingComponent    },
    ]
  },

  // ── Section boutique ────────────────────────────────────
  {
    path: 'boutique',
    component: BoutiqueComponent,
    children: [
      { path: '',            redirectTo: 'dashboard', pathMatch: 'full' },
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

  // ── Site client public (avec navbar layout) ─────────────
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '',              component: AccueilComponent,          title: 'Accueil — Centre Commercial' },
      { path: 'agenda',        component: AgendaComponent,           title: 'Agenda — Centre Commercial' },
      { path: 'boutiques',     component: BoutiquesComponent,        title: 'Boutiques — Centre Commercial' },
      { path: 'boutiques/:id', component: BoutiqueDetailComponent,   title: 'Boutique — Centre Commercial' },
      { path: 'foodcourt',     component: FoodcourtComponent,        title: 'FoodCourt — Centre Commercial' },
      { path: 'plan',          component: PlanComponent,             title: 'Plan — Centre Commercial' },
      {
        path: 'client',
        children: [
          { path: 'login',      component: LoginClientComponent,      title: 'Connexion — Centre Commercial' },
          { path: 'register',   component: RegisterComponent,         title: 'Inscription — Centre Commercial' },
          { path: 'profil',     component: ProfilClientComponent,     title: 'Mon profil — Centre Commercial',    canActivate: [clientAuthGuard] },
          { path: 'commandes',  component: CommandesClientComponent,  title: 'Mes commandes — Centre Commercial', canActivate: [clientAuthGuard] },
        ]
      }
    ]
  },

  { path: '**', redirectTo: '' }
];
