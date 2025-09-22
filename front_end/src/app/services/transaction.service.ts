import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) { }
    getHistorique() {
  return this.http.get<any>('http://localhost:3000/api/utilisateur/transactions', {
    withCredentials: true
  });
}
}
