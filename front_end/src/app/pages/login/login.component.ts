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
      this.message = '✅ Connexion réussie. Bienvenue Agent !';
      localStorage.setItem('agentId', res.agentId);
      setTimeout(() => {
        this.router.navigate(['/agent-dashboard']);
      }, 1500); // petite pause pour afficher le message
    },
    error: err => {
      this.message = '❌ Échec de connexion. Vérifiez vos identifiants.';
    }
  });
}

}
