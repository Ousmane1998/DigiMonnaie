import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerer-comptes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerer-comptes.component.html',
  styleUrls: ['./gerer-comptes.component.scss']
})
export class GererComptesComponent implements OnInit {
  comptes: any[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/comptes')
      .subscribe({
        next: res => this.comptes = res.comptes,
        error: err => console.error('Erreur chargement comptes :', err)
      });
  }

  supprimer(id: number): void {
    this.http.delete(`http://localhost:3000/api/comptes/${id}`)
      .subscribe(() => {
        this.message = 'Compte supprimé';
        this.comptes = this.comptes.filter(c => c.id !== id);
      });
  }

  bloquer(id: number): void {
    this.http.put(`http://localhost:3000/api/comptes/bloquer/${id}`, {})
      .subscribe(() => this.message = ' Compte bloqué');
  }

  modifier(id: number, nouveauNom: string): void {
    this.http.put(`http://localhost:3000/api/comptes/modifier/${id}`, { nom: nouveauNom })
      .subscribe(() => this.message = ' Compte modifié');
  }
}
