import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique-distributeur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique-distributeur.component.html',
  styleUrls: ['./historique-distributeur.component.scss']
})
export class HistoriqueDistributeurComponent implements OnInit {
  historique: any[] = [];       // ✅ toutes les transactions
  message = '';
  pageSize = 5;
pageIndex = 0;
historiqueFiltre: any[] = [];


  // ✅ Ajoute ceci
  searchTerm: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/api/transaction/historique-distributeur', {
      withCredentials: true
    }).subscribe({
      next: res => {
        this.historique = res.historique;
        this.historiqueFiltre = [...this.historique];
      },
      error: err => {
        this.message = '❌ Erreur : ' + (err.error?.error || err.message);
      }
    });
  }

  annuler(numero: string) {
    this.http.post('http://localhost:3000/api/transaction/annuler', {
      numeroTransaction: numero,
      motif: 'Annulation depuis historique'
    }, {
      withCredentials: true
    }).subscribe({
      next: res => {
        this.message = '✅ Transaction annulée';
        this.ngOnInit(); // recharge l’historique
      },
      error: err => {
        this.message = '❌ Erreur : ' + (err.error?.error || err.message);
      }
    });
  }

 
  // ✅ Getter pour filtrer les transactions
  get filteredHistorique() {
    if (!this.searchTerm) return this.historique;
    const term = this.searchTerm.toLowerCase();
    return this.historique.filter(tx =>
      tx.type.toLowerCase().includes(term) ||
      tx.montant.toString().includes(term) ||
      new Date(tx.dateTransaction).toLocaleString().toLowerCase().includes(term)
    );
  }

  get historiquePagine(): any[] {
  const start = this.pageIndex * this.pageSize;
  return this.historiqueFiltre.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.historiqueFiltre.length / this.pageSize);
}

}
