import { Component, OnInit } from '@angular/core';
import { UtilisateurService } from '../../../services/utilisateur.service';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss']
})
export class ProfilComponent implements OnInit {
  utilisateur: any;
  qrImage: string = '';
  qrData: string = '';
  erreurQR: boolean = false;

  constructor(private userService: UtilisateurService,private router: Router) {}


  ngOnInit(): void {
    this.userService.getProfil().subscribe({
      next: res => {
        this.utilisateur = res.utilisateur;

        if (!this.utilisateur?.id || !this.utilisateur?.role || !this.utilisateur?.numeroCompte) {
          this.erreurQR = true;
          return;
        }

        this.qrData = `DIGI-${this.utilisateur.id}-${this.utilisateur.role}-${this.utilisateur.numeroCompte}`;
        QRCode.toDataURL(this.qrData)
          .then(url => this.qrImage = url)
          .catch(err => {
            console.error('❌ Erreur QR code :', err);
            this.erreurQR = true;
          });
      },
      error: err => {
        console.error('❌ Erreur profil :', err);
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
   deconnexion(): void {
    localStorage.clear(); // ou removeItem('utilisateurId'), etc.
    this.router.navigate(['/login']);
  }
}
