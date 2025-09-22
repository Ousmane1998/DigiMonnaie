import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-mot-de-passe-oublie',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './mot-de-passe-oublie.component.html',
  styleUrls: ['./mot-de-passe-oublie.component.scss']
})
export class MotDePasseOublieComponent {
  email = '';
  message = '';

  constructor(private http: HttpClient) {}

  envoyerLien(): void {
    this.http.post('http://localhost:3000/api/auth/mot-de-passe-oublie', {
      email: this.email
    }).subscribe({
      next: () => {
        this.message = '✅ Un lien de réinitialisation a été envoyé à votre adresse.';
      },
      error: () => {
        this.message = '❌ Adresse introuvable ou erreur serveur.';
      }
    });
  }
}
