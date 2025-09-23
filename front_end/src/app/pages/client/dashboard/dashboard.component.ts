import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import * as QRCode from 'qrcode';
import { Router } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true, 
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  utilisateur: any;
  soldeVisible: boolean = true;
  showQR: boolean = false;
  qrImage: string = '';
  qrData: string = '';
  totalCommissions: number = 0;

  constructor(private userService: UtilisateurService, private router: Router) {}

  ngOnInit(): void {
    this.chargerDonneesUtilisateur();
    this.chargerCommissions();
  }

  /**
   * Charge les données de l'utilisateur connecté
   */
  private chargerDonneesUtilisateur(): void {
    this.userService.getProfil().subscribe({
      next: res => {
        this.utilisateur = res.utilisateur;
        this.genererQRCode();
      },
      error: err => {
        console.error('❌ Erreur chargement profil :', err);
        // Optionnel: Afficher un message d'erreur à l'utilisateur
      }
    });
  }

  /**
   * Charge les commissions totales
   */
  private chargerCommissions(): void {
    this.userService.getTotalCommissions().subscribe({
      next: res => this.totalCommissions = res.totalCommissions,
      error: err => console.error('❌ Erreur chargement commissions :', err)
    });
  }

  /**
   * Génère le QR Code de l'utilisateur
   */
  private genererQRCode(): void {
    if (!this.utilisateur) return;
    
    this.qrData = `${this.utilisateur.numeroCompte}`;
    
    QRCode.toDataURL(this.qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    .then(url => this.qrImage = url)
    .catch(err => console.error('❌ Erreur génération QR code :', err));
  }

  /**
   * Toggle la visibilité du solde
   */
  toggleSolde(): void {
    this.soldeVisible = !this.soldeVisible;
  }

  /**
   * Toggle l'affichage de la modal QR
   */
  toggleQR(): void {
    this.showQR = !this.showQR;
  }

  /**
   * Télécharge le QR Code
   */
  telechargerQR(): void {
    if (!this.qrImage || !this.utilisateur) return;
    
    const a = document.createElement('a');
    a.href = this.qrImage;
    a.download = `qr-${this.utilisateur.role}-${this.utilisateur.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Navigation Methods
  
  /**
   * Navigation vers la page de transfert
   */
  allerVersTransfert(): void {
    this.router.navigate(['/client-dashboard/transfert']);
  }

  /**
   * Navigation vers la page d'historique
   */
  allerVersHistorique(): void {
    this.router.navigate(['/client-dashboard/historique']);
  }

  /**
   * Navigation vers le profil
   */
  allerVersProfil(): void {
    this.router.navigate(['/client-dashboard/profil']);
  }

  /**
   * Navigation vers la page QR (si différente de la modal)
   */
  allerVersQR(): void {
    this.router.navigate(['/mon-qrcode']);
  }

  /**
   * Formate le montant pour l'affichage
   */
  formaterMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  }

  /**
   * Gère la fermeture de la modal QR en cliquant sur l'overlay
   */
  fermerModalQR(event: Event): void {
    event.preventDefault();
    this.showQR = false;
  }

  /**
   * Empêche la fermeture de la modal en cliquant sur le contenu
   */
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}