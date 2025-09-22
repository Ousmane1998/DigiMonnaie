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
    this.userService.getProfil().subscribe({
      next: res => {
        this.utilisateur = res.utilisateur;
        this.qrData = `DIGI-${this.utilisateur.id}-${this.utilisateur.role}-${this.utilisateur.numeroCompte}`;
        QRCode.toDataURL(this.qrData)
          .then(url => this.qrImage = url)
          .catch(err => console.error('❌ Erreur QR code :', err));
      },
      error: err => console.error('❌ Erreur profil', err)
    });

    this.userService.getTotalCommissions().subscribe({
    next: res => this.totalCommissions = res.totalCommissions,
    error: err => console.error('❌ Erreur chargement commissions :', err)
  });
  }
  

  toggleSolde(): void {
    this.soldeVisible = !this.soldeVisible;
  }

  toggleQR(): void {
    this.showQR = !this.showQR;
  }

  telechargerQR(): void {
    const a = document.createElement('a');
    a.href = this.qrImage;
    a.download = `qr-${this.utilisateur.role}-${this.utilisateur.id}.png`;
    a.click();
  }
  allerVersProfil(): void {
  this.router.navigate(['/client-dashboard/profil']);
}

allerVersQR(): void {
  this.router.navigate(['/mon-qrcode']);
}

  
}
