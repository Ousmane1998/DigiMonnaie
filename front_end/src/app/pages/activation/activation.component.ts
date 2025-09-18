import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activation',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  numeroCompte = '';
  form: FormGroup;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      mot_de_passe: ['', Validators.required],
      confirmer: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.numeroCompte = this.route.snapshot.paramMap.get('numeroCompte') || '';
    console.log('🔑 Numéro de compte reçu :', this.numeroCompte);
  }

  onSubmit(): void {
    if (this.form.value.mot_de_passe === this.form.value.confirmer) {
      const payload = {
        mot_de_passe: this.form.value.mot_de_passe
      };

      fetch(`http://localhost:3000/api/activation/${this.numeroCompte}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (res.ok) {
          alert('✅ Mot de passe créé avec succès');
        } else {
          alert('❌ Erreur lors de l’activation');
        }
      })
      .catch(err => {
        console.error('❌ Erreur réseau :', err);
      });
    } else {
      alert('❌ Les mots de passe ne correspondent pas');
    }
  }
}
