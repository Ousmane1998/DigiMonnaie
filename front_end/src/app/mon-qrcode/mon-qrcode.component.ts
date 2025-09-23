import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../services/utilisateur.service';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mon-qrcode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mon-qrcode.component.html',
  styleUrls: ['./mon-qrcode.component.scss']
})
export class MonQrcodeComponent implements OnInit {
  utilisateur: any;
  qrImage: string = '';
  qrData: string = '';
  erreurQR: boolean = false;

  constructor(private userService: UtilisateurService) {}

  ngOnInit(): void {
    this.userService.getProfil().subscribe({
      next: res => {
        this.utilisateur = res.utilisateur;

        // ✅ Vérifie que les données sont bien présentes
        if (!this.utilisateur?.id || !this.utilisateur?.role || !this.utilisateur?.numeroCompte) {
          console.error('❌ Données utilisateur incomplètes');
          this.erreurQR = true;
          return;
        }

        this.qrData = `${this.utilisateur.numeroCompte}`;

        // ✅ Génération du QR code
        QRCode.toDataURL(this.qrData)
          .then(url => {
            this.qrImage = url;
            console.log('✅ QR généré :', url);
          })
          .catch(err => {
            console.error('❌ Erreur QR code :', err);
            this.erreurQR = true;
          });
      },
      error: err => {
        console.error('❌ Erreur API utilisateur :', err);
        this.erreurQR = true;
      }
    });
  }

  telechargerQR(): void {
    if (!this.qrImage) return;
    const a = document.createElement('a');
    a.href = this.qrImage;
    a.download = `qr-${this.utilisateur.role}-${this.utilisateur.id}.png`;
    a.click();
  }

  fermer(): void {
    console.log('QR fermé');
  }
}
