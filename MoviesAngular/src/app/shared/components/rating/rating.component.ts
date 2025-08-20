import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-rating',
  imports: [MatIcon, NgClass],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
})
export class RatingComponent implements OnInit {
  ngOnInit(): void {
    this.prevRating = this.currentRating;
  }

  @Input({ required: true, transform: (valor: number) => Array(valor).fill(0) })
  maxRating!: number[];

  @Input()
  currentRating = 0;
  prevRating = 0;

  @Output()
  voted = new EventEmitter<number>();

  handleMouseEnter(index: number) {
    this.currentRating = index + 1;
  }
  handleMouseLeave() {
    if (this.prevRating !== 0) {
      this.currentRating = this.prevRating;
    } else {
      this.currentRating = 0;
    }
  }
  handleClick(index: number) {
    this.currentRating = index + 1;
    this.prevRating = this.currentRating;
    this.voted.emit(this.currentRating);
  }
}
