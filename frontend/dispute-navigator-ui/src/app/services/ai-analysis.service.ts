
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AIAnalysisRequest {
  disputeReason: string;
  transactionDescription: string;
  merchantExplanation: string;
}

export interface AIAnalysisResponse {
  analysis: string;
}

@Injectable({
  providedIn: 'root'
})
export class AIAnalysisService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/ai/analyze';

  analyzeDispute(
    request: AIAnalysisRequest
  ): Observable<AIAnalysisResponse> {

    return this.http.post<AIAnalysisResponse>(
      this.apiUrl,
      request
    );
  }
}
