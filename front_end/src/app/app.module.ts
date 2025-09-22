import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Composants à déclarer
import { LoginComponent } from './pages/login/login.component';
import { AgentComponent } from './pages/agent/agent.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarAgentComponent } from './layout/sidebar-agent/sidebar-agent.component';
import { DashboardAgentComponent } from './pages/agent/dashboard-agent/dashboard-agent.component';
import { CreerCompteComponent } from './pages/agent/creer-compte/creer-compte.component';
import { HistoriqueComponent } from './pages/agent/historique/historique.component';
import { AnnulerTransactionComponent } from './pages/agent/annuler-transaction/annuler-transaction.component';
import { ActivationComponent } from './pages/activation/activation.component';
import { MonQrcodeComponent } from './mon-qrcode/mon-qrcode.component';
import { ProfilComponent } from './pages/client/profil/profil.component';
import { ClientComponent } from './pages/client/client.component';
import { DashboardComponent } from './pages/client/dashboard/dashboard.component';
import { GererComptesComponent } from './pages/agent/gerer-comptes/gerer-comptes.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AgentComponent,
    HeaderComponent,
    SidebarAgentComponent,
    DashboardAgentComponent,
    CreerCompteComponent,
    HistoriqueComponent,
    AnnulerTransactionComponent,
    ActivationComponent,
    MonQrcodeComponent, 
    ProfilComponent,
    ClientComponent,
    DashboardComponent,
    GererComptesComponent 
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
