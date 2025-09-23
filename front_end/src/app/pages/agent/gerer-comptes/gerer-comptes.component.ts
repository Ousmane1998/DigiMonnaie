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
  filtre: string = '';
  message: string = '';
  nouveauNom: string = '';
  modalOuvert: boolean = false;
  compteSelectionne: any = null;
  pageSize = 5;
pageIndex = 0;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3000/api/comptes', {
      withCredentials: true
    }).subscribe({
      next: res => this.comptes = res.comptes,
      error: err => console.error('Erreur chargement comptes :', err)
    });
  }

  get comptesFiltres(): any[] {
    return this.comptes.filter(c =>
      (c.nom + ' ' + c.numero_compte)
        .toLowerCase()
        .includes(this.filtre.toLowerCase())
    );
  }

  supprimer(id: number): void {
    this.http.delete(`http://localhost:3000/api/comptes/${id}`, {
      withCredentials: true
    }).subscribe(() => {
      this.message = '🗑️ Compte supprimé';
      this.comptes = this.comptes.filter(c => c.id !== id);
    });
  }

  bloquer(id: number): void {
    this.http.put(`http://localhost:3000/api/comptes/bloquer/${id}`, {}, {
      withCredentials: true
    }).subscribe(() => {
      this.message = '🚫 Compte bloqué';
      this.ngOnInit();
    });
  }

 modifier(id: number, nouveauNom: string): void {
  if (!nouveauNom.trim()) return;
  this.http.put(`http://localhost:3000/api/comptes/modifier/${id}`, {
    nom: nouveauNom
  }, {
    withCredentials: true
  }).subscribe(() => {
    this.message = '✏️ Compte modifié';
    this.ngOnInit();
  });
}
 ouvrirModal(compte: any): void {
   console.log('🛠️ Modal ouvert pour :', compte);
    this.compteSelectionne = { ...compte };
    this.modalOuvert = true;
  }

  fermerModal(): void {
    this.modalOuvert = false;
    this.compteSelectionne = null;
  }
validerModification(): void {
  if (!this.compteSelectionne || !this.compteSelectionne.nom.trim()) {
    this.message = '❌ Le nom ne peut pas être vide.';
    return;
  }

  this.http.put(`http://localhost:3000/api/comptes/modifier/${this.compteSelectionne.id}`, {
    nom: this.compteSelectionne.nom
  }, {
    withCredentials: true
  }).subscribe({
    next: () => {
      this.message = '✏️ Compte modifié avec succès.';
      this.modalOuvert = false;
      this.compteSelectionne = null;
      this.ngOnInit(); // recharge la liste
    },
    error: err => {
      this.message = `❌ Erreur modification : ${err.error?.error || err.message}`;
    }
  });
}

get comptesPaginees(): any[] {
  const start = this.pageIndex * this.pageSize;
  return this.comptesFiltres.slice(start, start + this.pageSize);
}

get totalPages(): number {
  return Math.ceil(this.comptesFiltres.length / this.pageSize);
}

}
