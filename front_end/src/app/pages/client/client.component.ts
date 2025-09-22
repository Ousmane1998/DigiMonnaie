import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderClientComponent } from '../../layout/header-client/header-client.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterModule,HeaderClientComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {
  

}
