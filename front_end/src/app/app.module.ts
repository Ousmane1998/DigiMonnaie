import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } nfrom '@angular/router';
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
    AnnulerTransactionComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
