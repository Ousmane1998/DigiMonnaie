import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompteService } from '../../../services/compte.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';

interface CompteResponse {
  message: string;
}
@Component({
  selector: 'app-creer-compte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule// ✅ pour *ngIf, *ngFor, etc.
  ],
  templateUrl: './creer-compte.component.html',
  styleUrls: ['./creer-compte.component.scss']
})
export class CreerCompteComponent {
  currentStep = 1;
  form: FormGroup;

  constructor(private fb: FormBuilder,private compteService: CompteService) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      carte_identite: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      photo: [null],
      role: ['', Validators.required]
    });
  }

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.form.patchValue({ photo: input.files[0] });
    }
  }
  onSubmit() {
    if (this.form.valid) {
      const formData = new FormData();
       Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
      console.log('✅ Données soumises :', this.form.value);
     this.compteService.creerCompte(formData).subscribe({
  next: (res) => console.log('✅ Compte créé', res),
  error: (err) => console.error('❌ Erreur', err)
});

    }
    
  }
}
