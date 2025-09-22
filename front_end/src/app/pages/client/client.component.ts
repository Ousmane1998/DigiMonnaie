import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../layout/header-client/header-client.component';
import {FooterClientComponent} from '../../layout/footer-client/footer-client.component'
@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule,HeaderClientComponent,FooterClientComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {

}
