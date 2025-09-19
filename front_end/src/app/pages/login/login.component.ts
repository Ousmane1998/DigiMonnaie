import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  message = '';


  constructor(private http: HttpClient, private router: Router) {}

 login() {
  this.http.post<any>('http://localhost:3000/api/agent/login', {
    email: this.email,
    motDePasse: this.motDePasse
  }).subscribe({
    next: res => {
      const utilisateur = res.utilisateur;
      const role = utilisateur.role;
      

      this.message = `✅ Connexion réussie. Bienvenue ${role.charAt(0).toUpperCase() + role.slice(1)} !`;

      localStorage.setItem('utilisateurId', utilisateur.id);
      localStorage.setItem('role', role);

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
      }, 1500);
    },
    error: err => {
      this.message = '❌ Échec de connexion. Vérifiez vos identifiants.';
    }
  });
}


}
