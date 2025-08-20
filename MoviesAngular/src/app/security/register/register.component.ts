import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { extractErrorsIdentity } from '../../shared/functions/extractErrors';
import { UserCredentialsDTO } from '../security';
import { SecurityService } from '../security.service';
import { FormAuthenticationComponent } from "../form-authentication/form-authentication.component";

@Component({
  selector: 'app-register',
  imports: [FormAuthenticationComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  securityService = inject(SecurityService);
  router = inject(Router);
  errors: string[] = [];

  register(credentials: UserCredentialsDTO) {
    this.securityService.register(credentials).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
      const errors = extractErrorsIdentity(err);
      this.errors = errors;
      }
    })
}
}
