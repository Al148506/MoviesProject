import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserCredentialsDTO } from '../security';
import { ShowErrorsComponent } from "../../shared/components/show-errors/show-errors.component";
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-form-authentication',
  imports: [ShowErrorsComponent, ReactiveFormsModule, RouterLink, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule],
  templateUrl: './form-authentication.component.html',
  styleUrl: './form-authentication.component.css'
})
export class FormAuthenticationComponent {
  hidePassword = true;
  private formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    email: ['',{validators:[Validators.required, Validators.email]}],
    password: ['',{validators:[Validators.required]}]
  })

  @Input({required: true})
    title!: string;

  @Input({required: true})
    subtitle!: string;
  
  @Input()
    errors: string[] = [];

    @Output()
    postForm = new EventEmitter<UserCredentialsDTO>();

    obtainMessageErrorEmail(): string{
      let field = this.form.controls.email;
      if(field.hasError('required')){
        return 'The email field is required';
      }

      if(field.hasError('email')){
        return 'The email is invalid';
      }
      return '';
    }
    obtainMessageErrorPassword(): string{
      let field = this.form.controls.password;
      if(field.hasError('required')){
        return 'The password field is required';
      }
      return '';
    }

    saveChanges(){
      if(!this.form.valid){
        return;
      }

      const credentials = this.form.value as UserCredentialsDTO;
      this.postForm.emit(credentials);
    }
}
