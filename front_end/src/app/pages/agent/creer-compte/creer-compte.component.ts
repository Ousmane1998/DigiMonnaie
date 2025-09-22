import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompteService } from '../../../services/compte.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface CompteResponse {
  message: string;
}
@Component({
  selector: 'app-creer-compte',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule// ✅ pour *ngIf, *ngFor, etc.
  ],
  templateUrl: './creer-compte.component.html',
  styleUrls: ['./creer-compte.component.scss']
})
export class CreerCompteComponent {
  currentStep = 1;
  form: FormGroup;
  message = '';
  photoFile: File | null = null;

  constructor(private fb: FormBuilder,private compteService: CompteService, private http: HttpClient) {
    this.form = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      date_naissance: ['', Validators.required],
      carte_identite: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required]
    });
  }

  isStepValid(): boolean {
  if (this.currentStep === 1) {
    return this.form.get('nom')?.valid === true &&
           this.form.get('prenom')?.valid === true &&
           this.form.get('date_naissance')?.valid === true &&
           this.form.get('carte_identite')?.valid === true;
  }

  if (this.currentStep === 2) {
    return this.form.get('telephone')?.valid === true &&
           this.form.get('adresse')?.valid === true &&
           this.form.get('email')?.valid === true &&
           this.photoFile !== null;
  }

  if (this.currentStep === 3) {
    return this.form.get('role')?.valid === true;
  }

  return false;
}

nextStep(): void {
  if (!this.isStepValid()) {
    this.message = '❌ Veuillez remplir tous les champs requis avant de continuer.';
    return;
  }

  this.message = '';
  if (this.currentStep < 3) {
    this.currentStep++;
  }
}


  previousStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
onFileSelected(event: any): void {
    this.photoFile = event.target.files[0];
  }
  onSubmit(): void {
    if (this.form.invalid || !this.photoFile) {
      this.message = '❌ Veuillez remplir tous les champs et ajouter une photo.';
      return;
    }

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('photo', this.photoFile);

    this.http.post('http://localhost:3000/api/creer-compte', formData).subscribe({
      next: () => {
        this.message = '✅ Compte créé avec succès. Un email vous a été envoyé.';
        this.form.reset();
        this.currentStep = 1;
      },
      error: (err) => {
        this.message = `❌ Erreur : ${err.error?.error || 'Serveur indisponible'}`;
      }
    });
  }
}
