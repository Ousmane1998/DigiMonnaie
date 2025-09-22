import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompteService {
  constructor(private http: HttpClient) {}

  creerCompte(data: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/creer-compte', data);
  }
}
