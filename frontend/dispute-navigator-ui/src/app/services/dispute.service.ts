
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisputeService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/paypal/disputes';

  getDisputes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getDisputeById(disputeId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${disputeId}`);
  }
}
