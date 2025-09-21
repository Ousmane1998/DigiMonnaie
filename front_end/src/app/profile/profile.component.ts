import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user = {
    fullName: 'Jean Dupont',
    accountNumber: '1234567890',
    phone: '+225 07 08 09 10',
    email: 'jean.dupont@example.com',
    address: 'Abidjan, Côte d\'Ivoire'
  };
  
  isEditing = false;
  isLoading = false;

  ngOnInit() {
    // Simuler un chargement
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing; // ← Correction: this.isEditing
  }

  saveProfile() {
    console.log('Profil sauvegardé:', this.user);
    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }
}