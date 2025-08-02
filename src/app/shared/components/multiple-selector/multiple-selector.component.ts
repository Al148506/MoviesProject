import { Component, Input } from '@angular/core';
import { SelectorMultipleDTO } from './multiple-selector-model';

@Component({
  selector: 'app-multiple-selector',
  imports: [],
  templateUrl: './multiple-selector.component.html',
  styleUrl: './multiple-selector.component.css',
})
export class MultipleSelectorComponent {
  @Input({ required: true })
  Selected!: SelectorMultipleDTO[];

  @Input({ required: true })
  NotSelected!: SelectorMultipleDTO[];

  select(element: SelectorMultipleDTO, index: number) {
    this.Selected.push(element);
    this.NotSelected.splice(index, 1);
  }
  deselect(element: SelectorMultipleDTO, index: number) {
    this.NotSelected.push(element);
    this.Selected.splice(index, 1);
  }
  selectAll() {
    this.Selected.push(...this.NotSelected);
    this.NotSelected.length = 0;
  }
  deselectAll() {
    this.NotSelected.push(...this.Selected);
    this.Selected.length = 0;
  }
}
