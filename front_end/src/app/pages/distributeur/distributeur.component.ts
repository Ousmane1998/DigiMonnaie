import { Component } from '@angular/core';
import { HeaderComponent } from '../../layout/header/header.component'; 
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarDistributeurComponent } from '../../layout/sidebar-distributeur/sidebar-distributeur.component';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-distributeur',
  standalone: true,
  imports: [HeaderComponent,CommonModule ,RouterOutlet,SidebarDistributeurComponent,FooterComponent],
  templateUrl: './distributeur.component.html',
  styleUrl: './distributeur.component.scss'
})
export class DistributeurComponent {

}
