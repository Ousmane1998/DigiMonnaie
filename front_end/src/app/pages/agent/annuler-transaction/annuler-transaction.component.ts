import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annuler-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './annuler-transaction.component.html',
  styleUrls: ['./annuler-transaction.component.scss']
})
export class AnnulerTransactionComponent {
  numeroTransaction = '';
  motif = '';
  message = '';

  constructor(private http: HttpClient) {}

  annuler(): void {
    this.http.post<any>('http://localhost:3000/api/transaction/annuler', {
      numeroTransaction: this.numeroTransaction,
      motif: this.motif
    }).subscribe({
      next: res => this.message = res.message,
      error: err => this.message = '❌ Erreur : ' + err.error?.error || 'Serveur indisponible'
    });
  }
}
