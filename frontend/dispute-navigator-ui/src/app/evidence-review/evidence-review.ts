import { NgTemplateOutlet } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

interface Review {
  complaintSummary: string;
  checklist: string[];
  findings: string[];
  gaps: string[];
  draft: string;
  inputNotes: string[];
}

@Component({
  selector: 'app-evidence-review',
  imports: [NgTemplateOutlet],
  templateUrl: './evidence-review.html',
  styleUrl: './evidence-review.css'
})
export class EvidenceReview {
  readonly disputeId = input.required<string>();
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  readonly files = signal<File[]>([]);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly result = signal<Review | null>(null);
  readonly draft = signal('');
  readonly copyStatus = signal('');

  addFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selected = Array.from(input.files ?? []);
    input.value = '';
    if (this.files().length + selected.length > 5 ||
        selected.some(file => file.size === 0 || file.size > 5 * 1024 * 1024 ||
          !/\.(pdf|png|jpe?g|txt|csv)$/i.test(file.name))) {
      this.error.set('Choose up to five nonempty PDF, PNG, JPEG, TXT or CSV files, each 5 MB or less.');
      return;
    }
    this.error.set('');
    this.files.update(files => [...files, ...selected]);
  }

  removeFile(index: number): void {
    this.files.update(files => files.filter((_, i) => i !== index));
    this.error.set('');
  }

  analyze(complaint: string, notes: string): void {
    if (this.busy()) return;
    const form = new FormData();
    form.set('complaint', complaint.trim());
    form.set('notes', notes.trim());
    for (const file of this.files()) form.append('files', file);

    this.busy.set(true);
    this.result.set(null);
    this.error.set('');
    this.copyStatus.set('');
    const id = encodeURIComponent(this.disputeId());
    this.http.post<Review>(`http://localhost:8080/api/ai/disputes/${id}/evidence-review`, form)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.busy.set(false)))
      .subscribe({
        next: review => {
          this.result.set(review);
          this.draft.set(review.draft);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(error.error?.detail ??
            'Review failed. Check the backend and Ollama, then try again.');
        }
      });
  }

  async copyDraft(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.draft());
      this.copyStatus.set('Draft copied.');
    } catch {
      this.copyStatus.set('Select the draft text and copy it manually.');
    }
  }
}
