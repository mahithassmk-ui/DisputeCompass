
import {
  Component,
  OnInit,
  inject,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { DisputeService } from './services/dispute.service';
import { AIAnalysisComponent } from './ai-analysis/ai-analysis.component';
import { finalize, Subscription } from 'rxjs';
import { EvidenceReview } from './evidence-review/evidence-review';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AIAnalysisComponent, EvidenceReview],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {

  private disputeService = inject(DisputeService);
  private cdr = inject(ChangeDetectorRef);

  disputes: any[] = [];

  selectedDispute: any = null;
  selectedDisputeLoading = false;
  selectedDisputeError = '';

  loading = false;
  errorMessage = '';

  activeSection = 'overview';
  evidenceDisputeId = '';
  lastUpdated = new Date();

  private detailsRequest?: Subscription;

  ngAfterViewInit(): void {
    const script = document.createElement('script');

    script.src = 'https://www.paypalobjects.com/js/external/api.js';

    script.onload = () => {
      const paypalWindow = window as any;

      if (paypalWindow.paypal) {
        paypalWindow.paypal.use(['login'], (login: any) => {
          login.render({
            appid: 'BAALqETGTbXwBaB-KdRCXD_SWktrnv6eC4vc2bUA9mvZO7jy7JjlJHk1fyQU9K522y4QruuwRpeTWIg83k',
            authend: 'sandbox',
            scopes: 'openid',
            containerid: 'lippButton',
            responseType: 'code',
            locale: 'en-us',
            theme: 'blue',
            labelType: 'LWP',
            buttonSize: 'lg',
            fullPage: 'true',
            returnurl: 'http://127.0.0.1:8080/api/paypal/auth/callback'
          });
        });
      }
    };

    document.body.appendChild(script);
  }

  ngOnInit(): void {
    this.loadDisputes();
  }

  loadDisputes(): void {
    console.log('Starting PayPal dispute request...');

    this.loading = true;
    this.errorMessage = '';

    this.disputeService.getDisputes()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
          console.log('PayPal dispute list loading stopped.');
        })
      )
      .subscribe({
        next: (response) => {
          console.log('PayPal response received:', response);

          this.disputes = this.prioritize(response?.items ?? []);
          this.lastUpdated = new Date();
        },
        error: (error) => {
          console.error('PayPal request failed:', error);

          this.errorMessage =
            'Unable to connect to PayPal. Please try again.';
        }
      });
  }

  loadDisputeDetails(disputeId: string): void {
    this.detailsRequest?.unsubscribe();

    this.selectedDisputeLoading = true;
    this.selectedDisputeError = '';
    this.selectedDispute = null;

    this.cdr.detectChanges();

    this.detailsRequest = this.disputeService.getDisputeById(disputeId)
      .pipe(
        finalize(() => {
          this.selectedDisputeLoading = false;

          this.cdr.detectChanges();

          console.log(
            'Dispute details loading stopped:',
            this.selectedDisputeLoading
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Dispute details received:', response);

          this.selectedDispute = response;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Dispute details error:', error);

          this.selectedDisputeError =
            error?.error?.message ||
            'Unable to retrieve dispute details.';

          this.cdr.detectChanges();
        }
      });
  }

  closeDisputeDetails(): void {
    this.detailsRequest?.unsubscribe();
    this.selectedDispute = null;
    this.selectedDisputeError = '';
    this.selectedDisputeLoading = false;

    this.cdr.detectChanges();
  }

  openEvidenceStudio(disputeId: string): void {
    this.evidenceDisputeId = disputeId;
    this.setSection('evidence');
  }

  setSection(section: string): void {
    this.activeSection = section;
  }

  private prioritize(disputes: any[]): any[] {
    const rank = (item: any) => item.status === 'WAITING_FOR_SELLER_RESPONSE' ? 0
      : item.status === 'RESOLVED' ? 2 : 1;
    const due = (item: any) => Date.parse(item.seller_response_due_date ?? '') || Number.MAX_SAFE_INTEGER;
    return [...disputes].sort((a, b) => rank(a) - rank(b) || due(a) - due(b));
  }

  get openDisputes(): number {
    return this.disputes.filter(
      dispute =>
        dispute.status === 'OPEN' ||
        dispute.status === 'WAITING_FOR_SELLER_RESPONSE'
    ).length;
  }

  get resolvedDisputes(): number {
    return this.disputes.filter(
      dispute => dispute.status === 'RESOLVED'
    ).length;
  }
}
