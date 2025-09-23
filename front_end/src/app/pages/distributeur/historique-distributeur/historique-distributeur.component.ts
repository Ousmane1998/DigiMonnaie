import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historique-distributeur',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-distributeur.component.html',
  styleUrl: './historique-distributeur.component.scss'
})
export class HistoriqueDistributeurComponent implements OnInit {
  historique: any[] = [];
  message = '';
  pageSize = 5;
pageIndex = 0;
historiqueFiltre: any[] = [];

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

  get historiquePagine(): any[] {
  const start = this.pageIndex * this.pageSize;
  return this.historiqueFiltre.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.historiqueFiltre.length / this.pageSize);
}
}
