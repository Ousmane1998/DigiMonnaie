import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component';
import { SidebarAgentComponent } from '../../layout/sidebar-agent/sidebar-agent.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-agent',
  standalone: true,
  imports: [HeaderComponent, SidebarAgentComponent, RouterOutlet],
  templateUrl: './agent.component.html',
  styleUrl: './agent.component.scss'
})
export class AgentComponent {

}
