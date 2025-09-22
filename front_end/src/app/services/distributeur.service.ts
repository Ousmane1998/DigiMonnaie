import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistributeurService {
  private apiUrl = 'http://localhost:3000/api/distributeur';

  constructor(private http: HttpClient) {}

  getDashboardData(distributeurId: number): Observable<any> {
  return this.http.get<any>(`http://localhost:3000/api/distributeur/dashboard/${distributeurId}`, {
    withCredentials: true
  });
}

}
