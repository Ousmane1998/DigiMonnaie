import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AgentComponent } from './pages/agent/agent.component';

export const routes: Routes = [
    { path: '', component: LoginComponent }, // page par défaut
  { path: 'login', component: LoginComponent },
   { path: 'agent-dashboard', component: AgentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
