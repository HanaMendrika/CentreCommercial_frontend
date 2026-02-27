import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd } from '@angular/router';
import { LoadingComponent } from './loading/loading.component';
import { LoadingService } from './loading/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingComponent],
  template: `
    <!-- Loader -->
    <app-loading *ngIf="loadingService.loading()"></app-loading>

    <!-- Page content -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {

  constructor(private router: Router, public loadingService: LoadingService) {

    // Observer navigation Angular
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) this.loadingService.show();
      if (event instanceof NavigationEnd) this.loadingService.hide();
    });
  }
}