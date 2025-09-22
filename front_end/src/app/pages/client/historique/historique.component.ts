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
  searchTerm: string = ''; // ✅ mot recherché

  constructor(private transactionService: TransactionService, private http:HttpClient) {}

  ngOnInit(): void {
  this.http.get<any>('http://localhost:3000/api/transaction/historique-client', {
    withCredentials: true
  }).subscribe({
    next: res => this.transactions = res.transactions,
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

}

