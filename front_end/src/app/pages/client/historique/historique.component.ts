import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ pour ngModel
import { TransactionService } from '../../../services/transaction.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})

export class HistoriqueComponent implements OnInit {
  transactions: any[] = [];
  erreurChargement: boolean = false;
  filtreType: string = '';
filtreDate: string = '';
transactionsFiltrees: any[] = [];

//Variable de pagination:       // toutes les transactions // après filtrage
pageSize = 5;                     // nombre par page
pageIndex = 0;  


  // ✅ Ajoute ceci
searchTerm: string = '';

  constructor(private transactionService: TransactionService, private http:HttpClient) {}

 ngOnInit(): void {
  this.http.get<any>('http://localhost:3000/api/transaction/historique-client', {
    withCredentials: true
  }).subscribe({
    next: res => {
      this.transactions = res.transactions;
      this.transactionsFiltrees = [...this.transactions]; // ✅ initialise le tableau filtré
    },
    error: err => {
      console.error('❌ Erreur chargement historique client :', err);
      this.erreurChargement = true;
    }
  });
}


  // ✅ Getter pour filtrer
  get filteredTransactions() {
    if (!this.searchTerm) return this.transactions;
    const term = this.searchTerm.toLowerCase();
    return this.transactions.filter(tx =>
      tx.type.toLowerCase().includes(term) ||
      tx.montant.toString().includes(term) ||
      new Date(tx.dateTransaction).toLocaleString().toLowerCase().includes(term)
    );
  }


filtrerTransactions(): void {
  this.transactionsFiltrees = this.transactions.filter(tx => {
    const typeMatch = this.filtreType === '' || tx.type.toLowerCase().includes(this.filtreType.toLowerCase());
    const dateMatch = this.filtreDate === '' || tx.dateTransaction.startsWith(this.filtreDate);
    return typeMatch && dateMatch;
  });
    this.pageIndex = 0; // reset pagination
}

//Methode pour pagination: 
get transactionsPaginees(): any[] {
  const start = this.pageIndex * this.pageSize;
  return this.transactionsFiltrees.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.transactionsFiltrees.length / this.pageSize);
}


}

