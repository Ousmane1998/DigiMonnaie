
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DistributeurService } from '../../../services/distributeur.service';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tableau-de-bord.component.html',
  styleUrls: ['./tableau-de-bord.component.scss']
})
export class TableauDeBordComponent implements OnInit {
  solde: number = 0;
  commissionDuJour: number = 0;
  transactionsDuJour: number = 0;

  constructor(
    private distributeurService: DistributeurService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const distributeurId = parseInt(localStorage.getItem('distributeurId') || '0');

    if (!distributeurId || isNaN(distributeurId)) {
      console.warn('⚠️ Aucun distributeurId trouvé dans le localStorage.');
      this.router.navigate(['/login']);
      return;
    }

    this.distributeurService.getDashboardData(distributeurId).subscribe({
      next: (res: {
        solde: number;
        commissionDuJour: number;
        transactionsDuJour: number;
      }) => {
        this.solde = res.solde;
        this.commissionDuJour = res.commissionDuJour;
        this.transactionsDuJour = res.transactionsDuJour;
      },
      error: (err: any) => {
        console.error('❌ Erreur chargement dashboard distributeur :', err);
      }
    });
  }
}
