import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-dashboard-agent',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './dashboard-agent.component.html',
  styleUrl: './dashboard-agent.component.scss'
})
export class DashboardAgentComponent {

  clients = 0;
  transactions = 0;
  commissions = 0;
  historiques: any[] = [];
    selectedDate = '';
selectedType = '';
transactionsList: any[] = [];
transactionsFiltrées: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const agentId = localStorage.getItem('utilisateurId');
    this.http.get<any>(`http://localhost:3000/api/agent/dashboard/${agentId}` 
      , { withCredentials: true }
    )
      .subscribe({
        next: res => {
          this.clients = res.clients;
          this.transactions = res.transactions;
          this.commissions = res.commissions;
          this.historiques = res.historiques;
          this.transactionsList = res.historiques;
          this.transactionsFiltrées = [...this.transactionsList];

        },
        error: err => {
          console.error('❌ Erreur chargement dashboard :', err);
        }
      });
  }


filtrerTransactions(): void {
  this.transactionsFiltrées = this.transactionsList.filter(tx => {
    const matchDate = this.selectedDate ? tx.date_transaction?.startsWith(this.selectedDate) : true;
    const matchType = this.selectedType ? tx.type === this.selectedType : true;
    return matchDate && matchType;
  });
}

}
