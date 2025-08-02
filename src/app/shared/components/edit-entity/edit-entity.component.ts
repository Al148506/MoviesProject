import {
  Component,
  ComponentRef,
  inject,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ShowErrorsComponent } from '../show-errors/show-errors.component';
import { Router } from '@angular/router';
import { extractErrors } from '../../functions/extractErrors';
import { IServiceCRUD } from '../../interfaces/IServiceCRUD';
import { SERVICE_CRUD_TOKEN } from '../../providers/providers';
import { LoadingComponent } from '../loading/loading.component';


@Component({
  selector: 'app-edit-entity',
  imports: [ShowErrorsComponent, LoadingComponent],
  templateUrl: './edit-entity.component.html',
  styleUrl: './edit-entity.component.css',
})
export class EditEntityComponent<TDTO, TCreateDTO> implements OnInit {
  ngOnInit(): void {
    this.serviceCRUD.getById(this.id).subscribe((entity) => {
      this.loadComponent(entity);
    });
  }

  loadComponent(entity: any) {
    if (this.containerForm) {
      this.componentRef = this.containerForm.createComponent(this.form);
      this.componentRef.instance.model = entity;
      this.componentRef.instance.postForm.subscribe((entity: any) => {
        this.saveChanges(entity);
      });
      this.loading = false;
    }
  }

  @Input()
  id!: number;

  @Input({ required: true })
  title!: string;

  @Input({ required: true })
  routeIndex!: string;

  @Input({ required: true })
  form: any;

  errors: string[] = [];

  serviceCRUD = inject(SERVICE_CRUD_TOKEN) as IServiceCRUD<TDTO, TCreateDTO>;
  private router = inject(Router);
  loading = true;

  @ViewChild('containerForm', { read: ViewContainerRef })
  containerForm!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  saveChanges(entity: TCreateDTO) {
    this.serviceCRUD.update(this.id, entity).subscribe({
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
