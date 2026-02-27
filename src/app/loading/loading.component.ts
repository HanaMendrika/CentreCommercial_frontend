import { Component, effect } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    <div *ngIf="isLoading" class="cl-loading-overlay">
      <div class="cl-spinner"></div>
    </div>
  `,
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  isLoading = false;

  constructor(private loadingService: LoadingService) {
    // Sync signal avec variable locale pour déclencher *ngIf
    effect(() => {
      this.isLoading = this.loadingService.loading();
    });
  }
}