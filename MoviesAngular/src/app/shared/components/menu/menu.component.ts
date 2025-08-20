import { Component, HostListener, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthorizedComponent } from "../../../security/authorized/authorized.component";
import { SecurityService } from '../../../security/security.service';

@Component({
  selector: 'app-menu',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterLink, AuthorizedComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  isMobileMenuOpen = false;
  securityService = inject(SecurityService);

 

  /**
   * Toggle del menú móvil
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    const email = this.securityService.obtainFieldJWT("email");
    if (!email) return 'U';
    
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      return email.substring(0, 2).toUpperCase();
    }
  }

  /**
   * Cierra el menú móvil cuando se hace clic fuera de él
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (this.isMobileMenuOpen && 
        !mobileMenuToggle?.contains(target) && 
        !mobileMenu?.contains(target)) {
      this.closeMobileMenu();
    }
  }

  /**
   * Cierra el menú móvil cuando cambia el tamaño de la ventana
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  /**
   * Maneja el logout con animación
   */
  onLogout(): void {
    // Agregar una pequeña animación antes del logout
    const logoutBtn = document.querySelector('.logout-btn') as HTMLElement;
    if (logoutBtn) {
      logoutBtn.style.transform = 'scale(0.95)';
      setTimeout(() => {
        logoutBtn.style.transform = '';
        this.securityService.logout();
      }, 150);
    } else {
      this.securityService.logout();
    }
  }
}






 