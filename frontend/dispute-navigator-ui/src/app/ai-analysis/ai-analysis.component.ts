
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIAnalysisService } from '../services/ai-analysis.service';

@Component({
  selector: 'app-ai-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-analysis.component.html',
  styleUrl: './ai-analysis.component.css'
})
export class AIAnalysisComponent {

  private aiService = inject(AIAnalysisService);
  private cdr = inject(ChangeDetectorRef);

  disputeReason = '';
  transactionDescription = '';
  merchantExplanation = '';

  analysis = '';
  loading = false;
  errorMessage = '';

  analyze(): void {
    if (!this.disputeReason || !this.transactionDescription.trim()) {
      this.errorMessage =
        'Please provide a dispute reason and transaction description.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.analysis = '';
    this.cdr.detectChanges();

    this.aiService.analyzeDispute({
      disputeReason: this.disputeReason,
      transactionDescription: this.transactionDescription,
      merchantExplanation: this.merchantExplanation ||
        'No additional explanation provided.'
    }).subscribe({

      next: (response) => {
        this.analysis = response?.analysis ?? '';
        this.loading = false;

        console.log('Loading after response:', this.loading);

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('AI request failed:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to analyse this dispute. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  reset(): void {
    this.disputeReason = '';
    this.transactionDescription = '';
    this.merchantExplanation = '';

    this.analysis = '';
    this.errorMessage = '';
    this.loading = false;

    this.cdr.detectChanges();
  }
}
