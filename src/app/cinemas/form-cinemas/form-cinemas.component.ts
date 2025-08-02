import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { CinemaCreationDTO } from '../cinemas';
import { MapComponent } from "../../shared/components/map/map.component";
import { Coordinate } from '../../shared/components/map/coordinate';

@Component({
  selector: 'app-form-cinemas',
  imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatButtonModule, RouterLink, MapComponent],
  templateUrl: './form-cinemas.component.html',
  styleUrl: './form-cinemas.component.css'
})
export class FormCinemasComponent implements OnInit {
  ngOnInit(): void {
    if(this.model !== undefined){
      this.form.patchValue(this.model)
      this.InitialCoordinates = [{text: 'Ubicación seleccionada', latitude: this.model.latitude, longitude: this.model.longitude}];
    }
  }
  @Input()
  model?: CinemaCreationDTO;

  @Output()
  postForm = new EventEmitter<CinemaCreationDTO>();
  InitialCoordinates: Coordinate[] = [];

  private formBuilder = inject(FormBuilder);
  
  form = this.formBuilder.group({
    name: ['',{validators:[Validators.required]}],
    longitude: new FormControl<number | null>(null,[Validators.required]),
    latitude:  new FormControl<number | null>(null,[Validators.required])
  })

  obtainErrorNameField(): string{
    let name = this.form.controls.name;
    if(name.hasError('required')){
      return "The name field is required";
    }
    return "";
  }

  selectedCoordinate(coordinate: Coordinate){
    this.form.patchValue(coordinate);
  }

  saveChanges(){
    if(!this.form.valid){
      return;
    }
    const cinema = this.form.value as CinemaCreationDTO;
    this.postForm.emit(cinema);
  }

}
