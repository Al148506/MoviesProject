import { Component, inject } from '@angular/core';
import { SecurityService } from '../security.service';
import { Router } from '@angular/router';
import { UserCredentialsDTO } from '../security';
import { extractErrorsIdentity } from '../../shared/functions/extractErrors';
import { FormAuthenticationComponent } from '../form-authentication/form-authentication.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormAuthenticationComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  securityService = inject(SecurityService);
  router = inject(Router);
  errors: string[] = [];

  login(credentials: UserCredentialsDTO) {
    this.securityService.login(credentials).subscribe({
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
