import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
  historiques: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const agentId = localStorage.getItem('utilisateurId');
    this.http.get<any>(`http://localhost:3000/api/agent/historique/${agentId}`)
      .subscribe({
        next: res => this.historiques = res.historiques,
        error: err => console.error('❌ Erreur chargement historique :', err)
      });
  }
}
