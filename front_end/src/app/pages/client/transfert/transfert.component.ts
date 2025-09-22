import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';


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


  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      destinataire: [''],
      montant: [0],
     
    });
  }

  calculerFrais() {
    const montant = this.form.value.montant || 0;
    this.frais = Math.round(montant * 0.02);
    this.total = montant + this.frais;
  }

  envoyerTransfert() {
    const data = {
      destinataire: this.form.value.destinataire,
      montant: this.form.value.montant,
      frais: this.frais,
    };
const headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
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

