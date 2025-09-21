import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AgentComponent } from './pages/agent/agent.component';
import { DashboardAgentComponent } from './pages/agent/dashboard-agent/dashboard-agent.component';
import { CreerCompteComponent } from './pages/agent/creer-compte/creer-compte.component';
import { HistoriqueComponent } from './pages/agent/historique/historique.component';
import { AnnulerTransactionComponent } from './pages/agent/annuler-transaction/annuler-transaction.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { GererComptesComponent } from './pages/agent/gerer-comptes/gerer-comptes.component';
import { ProfileComponent } from './profile/profile.component';

// Routes distributeur
import { DistributeurComponent } from './pages/distributeur/distributeur.component';
import { TableauDeBordComponent } from './pages/distributeur/tableau-de-bord/tableau-de-bord.component';
import { DepotRetraitComponent } from './pages/distributeur/depot-retrait/depot-retrait.component';
import { HistoriqueDistributeurComponent } from './pages/distributeur/historique-distributeur/historique-distributeur.component';
import { AnnulerTransactionDistributeurComponent } from './pages/distributeur/annuler-transaction-distributeur/annuler-transaction-distributeur.component';

// Import des guards (à créer si nécessaire)
// import { AuthGuard } from './guards/auth.guard';
// import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Routes publiques
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'activation/:numeroCompte', component: ActivationComponent },
  { path: 'profile', component: ProfileComponent },

  // Routes agent (protégées)
  {
    path: 'agent-dashboard',
    component: AgentComponent,
    // canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['agent'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardAgentComponent },
      { path: 'creer-compte', component: CreerCompteComponent },
      { path: 'historique', component: HistoriqueComponent },
      { path: 'annuler-transaction', component: AnnulerTransactionComponent },
      { path: 'gerer-comptes', component: GererComptesComponent }
    ]
  },

  // Routes distributeur (protégées)
  {
    path: 'distributeur-dashboard',
    component: DistributeurComponent,
    // canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['distributeur'] },
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'depot-retrait', component: DepotRetraitComponent },
      { path: 'historique', component: HistoriqueDistributeurComponent },
      { path: 'annuler-transaction', component: AnnulerTransactionDistributeurComponent }
    ]
  },

  // Route par défaut (redirection vers login)
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

