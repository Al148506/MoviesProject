import { Component, inject, Input, input } from '@angular/core';
import { SecurityService } from '../security.service';

@Component({
  selector: 'app-authorized',
  imports: [],
  templateUrl: './authorized.component.html',
  styleUrl: './authorized.component.css'
})
export class AuthorizedComponent {
  securityService = inject(SecurityService);
  @Input()
  rol?:string

  itsAuthorized(): boolean{
    if(this.rol){
      return this.securityService.obtainRol() === this.rol;
    }else{
      return this.securityService.itsLogged();
    }
  }
}
