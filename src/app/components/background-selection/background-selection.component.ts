import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Background } from '../../model/character.model';

@Component({
  selector: 'app-background-selection',
  templateUrl: './background-selection.component.html',
})
export class BackgroundSelectionComponent {
  @Input() backgrounds: Background[] = [];
  @Input() selectedBackground: Background | undefined;
  
  @Output() backgroundChange = new EventEmitter<Background>();
}