// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://api.votreapplication.com'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user);
  }
}
