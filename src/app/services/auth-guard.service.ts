import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '@services/index';

export namespace AuthGuardService {
  export const canActivate = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {
    const authService =  inject(AuthService);
    const router = inject(Router);

    const isUserAuthenticated = authService.isUserAuthenticated();


    
    if (isUserAuthenticated) {
      return true;
    }

    router.navigate(['/login']);
    return false;
  };
}
