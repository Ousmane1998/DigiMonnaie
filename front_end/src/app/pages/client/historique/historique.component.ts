import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../services/transaction.service';

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

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getHistorique().subscribe({
      next: res => this.transactions = res.transactions,
      error: err => {
        console.error('❌ Erreur chargement historique :', err);
        this.erreurChargement = true;
      }
    });
  }
}
