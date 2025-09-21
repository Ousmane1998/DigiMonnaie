import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-distributor-dashboard',
  templateUrl: './distributor-dashboard.component.html',
  styleUrls: ['./distributor-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DistributorDashboardComponent implements OnInit {
  // 1. PROPRIÉTÉS (variables) en premier
  dashboardData = {
    solde: 250000,
    commissionJour: 12500,
    transactionsAujourdhui: 45,
    transactionsRecent: [
      {
        id: 1,
        client: 'Fatima Ly',
        type: 'Dépôt',
        montant: 5000,
        date: new Date('2024-01-15T14:32:00'),
        statut: 'completé'
      }
      // ... autres transactions
    ]
  };

  // 2. MÉTHODES HELPER (fonctions utilitaires)
  getTransactionIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Dépôt': 'fas fa-money-bill-wave',
      'Retrait': 'fas fa-hand-holding-usd',
      'Transfert': 'fas fa-exchange-alt'
    };
    return icons[type] || 'fas fa-exchange-alt';
  }

  getAmountClass(type: string): string {
    return type === 'Retrait' ? 'text-danger' : 'text-success';
  }

  formatMoney(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  }

  // 3. HOOKS DE LIFECYCLE (ngOnInit, etc.)
  ngOnInit(): void {
    console.log('Dashboard distributeur initialisé');
  }

  // 4. MÉTHODES D'ACTION (interactions utilisateur)
  onDepot(): void {
    console.log('Redirection vers dépôt');
    // this.router.navigate(['/depot']);
  }

  onRetrait(): void {
    console.log('Redirection vers retrait');
    // this.router.navigate(['/retrait']);
  }

  onVoirHistorique(): void {
    console.log('Redirection vers historique');
    // this.router.navigate(['/historique']);
  }
}
