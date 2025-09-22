import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ pour *ngIf
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reinitialiser-mot-de-passe',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  templateUrl: './reinitialiser-mot-de-passe.component.html',
  styleUrls: ['./reinitialiser-mot-de-passe.component.scss']
})
export class ReinitialiserMotDePasseComponent {
  token = '';
  nouveauMotDePasse = '';
confirmationMotDePasse = '';
message = '';

  constructor(private route: ActivatedRoute,private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      console.log('🔐 Token reçu :', this.token);
    });
  }
  valider(): void {
  if (this.nouveauMotDePasse !== this.confirmationMotDePasse) {
    this.message = '❌ Les mots de passe ne correspondent pas.';
    return;
  }

  // 🔐 Appel backend ici pour valider le token et changer le mot de passe
  this.http.post('http://localhost:3000/api/auth/reinitialiser-mot-de-passe', {
    token: this.token,
    nouveauMotDePasse: this.nouveauMotDePasse
  }).subscribe({
    next: () => {
      this.message = '✅ Mot de passe réinitialisé avec succès.';
    },
    error: () => {
      this.message = '❌ Erreur lors de la réinitialisation.';
    }
  });
}
}
