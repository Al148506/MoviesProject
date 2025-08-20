import {
  AfterViewInit,
  Component,
  ComponentRef,
  inject,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { SERVICE_CRUD_TOKEN } from '../../providers/providers';
import { IServiceCRUD } from '../../interfaces/IServiceCRUD';
import { Router } from '@angular/router';
import { extractErrors } from '../../functions/extractErrors';
import { ShowErrorsComponent } from '../show-errors/show-errors.component';

@Component({
  selector: 'app-create-entity',
  imports: [ShowErrorsComponent],
  templateUrl: './create-entity.component.html',
  styleUrl: './create-entity.component.css',
})
export class CreateEntityComponent<TDTO, TCreateDTO> implements AfterViewInit {
  ngAfterViewInit(): void {
    this.componentRef = this.containerForm.createComponent(this.form);
    this.componentRef.instance.postForm.subscribe((entity: any) => {
      this.saveChanges(entity);
    });
  }

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  routeIndex!: string;

  @Input({ required: true })
  form: any;

  errors: string[] = [];

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreateDTO>;
  private router = inject(Router);

  @ViewChild('containerForm', { read: ViewContainerRef })
  containerForm!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  saveChanges(entity: TCreateDTO) {
    this.serviceCRUD.create(entity).subscribe({
      //Action when Api Response is OK
      next: () => {
        this.router.navigate([this.routeIndex]);
      },
      error: (err) => {
        const errors = extractErrors(err);
        this.errors = errors;
      },
    });
  }
}
