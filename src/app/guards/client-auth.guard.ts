import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ClientAuthService } from '../services/client-auth.service';

export const clientAuthGuard: CanActivateFn = (route, state) => {
  const auth   = inject(ClientAuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/client/login'], { queryParams: { next: state.url } });
  return false;
};
