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

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'agent-dashboard',
    component: AgentComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // ✅ redirection par défaut
      { path: 'dashboard', component: DashboardAgentComponent },
      { path: 'creer-compte', component: CreerCompteComponent },
      { path: 'historique', component: HistoriqueComponent },
      { path: 'annuler-transaction', component: AnnulerTransactionComponent }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
