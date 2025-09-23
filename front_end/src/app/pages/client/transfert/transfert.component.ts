import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';



@Component({
  selector: 'app-transfert',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent {
  form: FormGroup;
  frais: number = 0;
  total: number = 0;
  montantRecu: number = 0; // ✅ ajouté
  message: string = ''; // message à afficher

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      destinataire: ['', [Validators.required]],
      montant: [0, [Validators.required, Validators.min(1)]],
      montantRecu: [0] // si tu veux binder aussi le montant reçu
    });
  }
  
// Quand on modifie le montant envoyé
calculerFrais() {
  const montant = this.form.value.montant || 0;
  this.frais = Math.round(montant * 0.02); // ✅ 2% au lieu de 1%
  this.total = montant;
  this.montantRecu = montant - this.frais;
  this.form.patchValue({ montantRecu: this.montantRecu }, { emitEvent: false });
}

// Quand on modifie le montant reçu
calculerMontantEnvoye() {
  const recu = this.form.value.montantRecu || 0;
  this.montantRecu = recu;
  this.total = Math.round((recu / 0.98) / 100) * 100; // ✅ 98% au lieu de 99%
  this.frais = this.total - recu;
  this.form.patchValue({ montant: this.total }, { emitEvent: false });
}

  envoyerTransfert() {
    if (this.form.invalid) {
      this.message = '❌ Veuillez remplir tous les champs correctement.';
      return;
    }

    const data = {
      destinataire: this.form.value.destinataire,
      montant: this.form.value.montant,
      frais: this.frais,
      montantRecu: this.form.value.montantRecu
    };

 const headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );

    this.http.post('http://localhost:3000/api/client/transfert', data, {
      withCredentials: true,
      headers
    }).subscribe({
      next: res => {
        this.message = '✅ Transfert effectué avec succès.';
        this.form.reset();
        this.frais = 0;
        this.total = 0;
        this.montantRecu = 0;
      },
      error: err => {
        this.message = `❌ Erreur : ${err.error?.error || 'Échec du transfert.'}`;
      }
    });
  }
}

