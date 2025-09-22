import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderClientComponent } from '../../../layout/header-client/header-client.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderClientComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
