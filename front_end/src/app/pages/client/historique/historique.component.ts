import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  transactions: any[] = [];
  erreurChargement: boolean = false;

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

}
