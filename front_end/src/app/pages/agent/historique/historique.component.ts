import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historique-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  transactions: any[] = [];
  filtreDate: string = '';
  message: string = '';
  datePipe = new DatePipe('fr-FR');
  pageSize = 5;
pageIndex = 0;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/agent/historique-agent', {
      withCredentials: true
    }).subscribe({
      next: res => {
        console.log('📦 Transactions reçues :', res.transactions);
        this.transactions = res.transactions;
      },
      error: err => console.error('❌ Erreur chargement historique :', err)
    });
  }

  get transactionsFiltres(): any[] {
    if (!this.filtreDate) return this.transactions;
    return this.transactions.filter(t => {
      const dateFormatee = this.datePipe.transform(t.date_transaction, 'dd/MM/yyyy');
      return dateFormatee?.includes(this.filtreDate);
    });
  }

  annuler(id: number): void {
    this.http.post(`http://localhost:3000/api/transaction/annuler`, {
      idTransaction: id
    }, {
      withCredentials: true
    }).subscribe(() => {
      this.message = 'Transaction annulée';
      this.ngOnInit();
    });
  }

  get transactionsPaginees(): any[] {
  const filtrées = this.transactionsFiltres;
  const start = this.pageIndex * this.pageSize;
  return filtrées.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.transactionsFiltres.length / this.pageSize);
}

}
