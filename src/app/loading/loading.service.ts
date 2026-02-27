// loading.service.ts
import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading: WritableSignal<boolean> = signal(false);

  show() {
    this.loading.set(true);
  }

  hide() {
    setTimeout(() => this.loading.set(false), 1000); // délai min 100ms
  }
}