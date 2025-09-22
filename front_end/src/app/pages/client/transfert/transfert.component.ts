import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-transfert',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './transfert.component.html',
  styleUrls: ['./transfert.component.scss']
})
export class TransfertComponent {
  form: FormGroup;
  frais: number = 0;
  total: number = 0;
  montantRecu: number = 0;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      destinataire: [''],
      montant: [0],
      montantRecu: [0] // ✅ ajouté pour liaison avec le champ "montant reçu"
    });
  }

  // Quand on modifie le montant envoyé
  calculerFrais() {
    const montant = this.form.value.montant || 0;
    this.frais = Math.round(montant * 0.01); // 1% frais
    this.total = montant;
    this.montantRecu = montant - this.frais;
    this.form.patchValue({ montantRecu: this.montantRecu }, { emitEvent: false });
  }

  // Quand on modifie le montant reçu
  calculerMontantEnvoye() {
    const recu = this.form.value.montantRecu || 0;
    this.montantRecu = recu;
    this.total = Math.round(recu / 0.99); // puisque montantRecu = montantEnvoye - 1%
    this.frais = this.total - recu;
    this.form.patchValue({ montant: this.total }, { emitEvent: false });
  }

  envoyerTransfert() {
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
      withCredentials: true
    }).subscribe({
      next: res => console.log('Transfert réussi', res),
      error: err => {
        console.error('Erreur transfert', err);
        alert('Erreur : ' + err.message);
      }
    });
  }
}
