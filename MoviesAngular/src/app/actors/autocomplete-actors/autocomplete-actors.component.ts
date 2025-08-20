import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ActorAutoCompleteDTO } from '../actors';
import { ActorsService } from '../actors.service';

@Component({
  selector: 'app-autocomplete-actors',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    DragDropModule,
  ],
  templateUrl: './autocomplete-actors.component.html',
  styleUrls: ['./autocomplete-actors.component.css'],
})
export class AutocompleteActorsComponent implements OnInit{

  ngOnInit(): void {
    this.control.valueChanges.subscribe(value => {
      if(typeof value === 'string' && value){
        this.actorsService.getByName(value).subscribe(actors => {
          this.actors = actors;
        })
      }
    })
  }
  control = new FormControl();
  actors: ActorAutoCompleteDTO[] = [];
  @Input({required:true})
  actorsSelected: ActorAutoCompleteDTO[] = [];

  columnsToShow = ['photo', 'name', 'character', 'actions'];

  actorsService = inject(ActorsService);

  @ViewChild(MatTable) table!: MatTable<ActorAutoCompleteDTO>;

  actorSelected(event: MatAutocompleteSelectedEvent) {
    this.actorsSelected.push(event.option.value);
    this.control.patchValue('');

    if (this.table != undefined) {
      this.table.renderRows();
    }
  }
  endDrag(event: CdkDragDrop<any[]>) {
    const previousIndex = this.actorsSelected.findIndex(
      (actor) => actor === event.item.data
    );
    moveItemInArray(this.actorsSelected, previousIndex, event.currentIndex);
    this.table.renderRows();
  }
  delete(actor: ActorAutoCompleteDTO) {
    const indice = this.actorsSelected.findIndex(
      (a: ActorAutoCompleteDTO) => a.id === actor.id
    );
    this.actorsSelected.splice(indice, 1);
    this.table.renderRows();
  }
}
