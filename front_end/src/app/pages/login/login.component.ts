import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    if (!this.email || !this.motDePasse) {
      this.message = '❌ Veuillez remplir tous les champs.';
      return;
    }

    this.http.post<any>('http://localhost:3000/api/agent/login', {
      email: this.email,
      motDePasse: this.motDePasse
    }).subscribe({
      next: res => {
        const utilisateur = res.utilisateur;
        const role = utilisateur.role.toLowerCase();

        // Message de succès
        this.message = `✅ Connexion réussie. Bienvenue ${utilisateur.prenom} !`;

        // Sauvegarde dans localStorage
        localStorage.setItem('utilisateurId', utilisateur.id);
        localStorage.setItem('role', role);

        // Redirection selon le rôle
        setTimeout(() => {
          switch (role) {
            case 'agent':
              this.router.navigate(['/agent-dashboard']);
              break;
            case 'client':
              this.router.navigate(['/client-dashboard']);
              break;
            case 'distributeur':
              this.router.navigate(['/distributeur-dashboard']);
              break;
            default:
              this.message = '❌ Rôle inconnu. Accès refusé.';
          }
        }, 1000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.message = '❌ Email ou mot de passe incorrect.';
        } else {
          this.message = '❌ Erreur serveur. Veuillez réessayer.';
        }
      }
    });
  }
}
