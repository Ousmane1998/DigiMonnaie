import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AgentComponent } from './pages/agent/agent.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarAgentComponent } from './layout/sidebar-agent/sidebar-agent.component';

import { DashboardAgentComponent } from './pages/agent/dashboard-agent/dashboard-agent.component';
import { CreerCompteComponent } from './pages/agent/creer-compte/creer-compte.component';
import { HistoriqueComponent } from './pages/agent/historique/historique.component';
import { AnnulerTransactionComponent } from './pages/agent/annuler-transaction/annuler-transaction.component';
import { ActivationComponent } from './pages/activation/activation.component';
import{GererComptesComponent} from './pages/agent/gerer-comptes/gerer-comptes.component';

//Routes distributeur
import { DistributeurComponent } from './pages/distributeur/distributeur.component';
import { TableauDeBordComponent } from './pages/distributeur/tableau-de-bord/tableau-de-bord.component';
import { DepotRetraitComponent } from './pages/distributeur/depot-retrait/depot-retrait.component';
import { HistoriqueDistributeurComponent } from './pages/distributeur/historique-distributeur/historique-distributeur.component';
import { AnnulerTransactionDistributeurComponent } from './pages/distributeur/annuler-transaction-distributeur/annuler-transaction-distributeur.component';
import { ClientComponent } from './pages/client/client.component';
import { DashboardComponent } from './pages/client/dashboard/dashboard.component';
import { MonQrcodeComponent } from './mon-qrcode/mon-qrcode.component';
import { ProfilComponent } from './pages/client/profil/profil.component';



export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'activation/:numeroCompte', component: ActivationComponent },
  {
    path: 'agent-dashboard',
    component: AgentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // ✅ redirection par défaut
      { path: 'dashboard', component: DashboardAgentComponent },
      { path: 'creer-compte', component: CreerCompteComponent },
      { path: 'historique', component: HistoriqueComponent },
      { path: 'annuler-transaction', component: AnnulerTransactionComponent },
      { path: 'gerer-compte', component: GererComptesComponent }
       
    ]
  },
  {
    path: 'distributeur-dashboard',
    component: DistributeurComponent,
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { path: 'depot-retrait', component: DepotRetraitComponent },
      { path: 'historique-distributeur', component: HistoriqueDistributeurComponent },
      { path: 'annuler-transaction-distributeur', component: AnnulerTransactionDistributeurComponent }
    ]
  },
 
  {
    path: 'client-dashboard',
    component: ClientComponent,
    children: [
       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
      {
        path: 'dashboard',
        component: DashboardComponent // ✅ accessible via /client-dashboard/dashboard
      },
      {
        path: 'transfert',
        loadComponent: () =>
          import('./pages/client/transfert/transfert.component').then(m => m.TransfertComponent)
      },
      {
        path: 'historique',
        loadComponent: () =>
          import('./pages/client/historique/historique.component').then(m => m.HistoriqueComponent)
      },
      
      {
        path: 'profil',
        loadComponent: () =>
          import('./pages/client/profil/profil.component').then(m => m.ProfilComponent)
      },
      {
  path: 'mon-qrcode',
  loadComponent: () =>
    import('./mon-qrcode/mon-qrcode.component').then(m => m.MonQrcodeComponent)
}
       ]
  },
  
 
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
