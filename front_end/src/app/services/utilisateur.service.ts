import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  constructor(private http: HttpClient) {}

  getProfil() {
    return this.http.get<any>('http://localhost:3000/api/utilisateur/profil', {
      withCredentials: true
    });
  }
getTotalCommissions(): Observable<any> {
  return this.http.get<any>('http://localhost:3000/api/utilisateur/total-commissions', {
    withCredentials: true
  });
}



}
