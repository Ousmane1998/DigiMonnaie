import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depot-retrait',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './depot-retrait.component.html',
  styleUrls: ['./depot-retrait.component.scss']
})
export class DepotRetraitComponent {
 type = 'depot';
montant = 0;
destinataireCompteId = '';
distributeurCompteId = '';
message = '';
frais = 0;
commission = 0;
  constructor(private http: HttpClient) {}

validerTransaction(): void {
  const distributeurUtilisateurId = localStorage.getItem('utilisateurId');
 console.log({
    type: this.type,
    montant: this.montant,
    destinataireCompteId: this.destinataireCompteId,
    distributeurUtilisateurId
  });
  this.http.post<any>('http://localhost:3000/api/transaction/depot-retrait', {
    type: this.type,
    montant: this.montant,
    destinataireCompteId: this.destinataireCompteId,
    distributeurUtilisateurId
  }).subscribe({
    next: res => {
      this.message = res.message;
      this.frais = res.frais;
      this.commission = res.commission;
    },
    error: err => this.message = '❌ Erreur : ' + err.error?.error || 'Serveur indisponible'
  });
}
}
