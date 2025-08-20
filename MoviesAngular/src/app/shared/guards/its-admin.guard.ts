import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../../security/security.service';

export const itsAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const securityService = inject(SecurityService);

  if(securityService.obtainRol() === 'admin'){
    return true;
  }
  router.navigate(['/login']);
  return true;
};
