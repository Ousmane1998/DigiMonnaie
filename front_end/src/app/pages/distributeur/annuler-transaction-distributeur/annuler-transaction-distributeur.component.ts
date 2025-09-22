import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-annuler-transaction',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './annuler-transaction-distributeur.component.html',
  styleUrl: './annuler-transaction-distributeur.component.scss'
})
export class AnnulerTransactionDistributeurComponent {
  numeroTransaction = '';
  motif = '';
  message = '';

  constructor(private http: HttpClient) {}

  annulerTransaction() {
    if (!this.numeroTransaction || !this.motif) {
      this.message = '❌ Veuillez remplir tous les champs.';
      return;
    }

    this.http.post('http://localhost:3000/api/transaction/annuler', {
      numeroTransaction: this.numeroTransaction,
      motif: this.motif
    }, {
      withCredentials: true
    }).subscribe({
      next: res => {
        this.message = '✅ Transaction annulée avec succès.';
        this.numeroTransaction = '';
        this.motif = '';
      },
      error: err => {
        this.message = '❌ Erreur : ' + (err.error?.error || err.message);
      }
    });
  }
}
