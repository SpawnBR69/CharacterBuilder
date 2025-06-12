import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Class } from '../../model/character.model';

@Component({
  selector: 'app-class-selection',
  templateUrl: './class-selection.component.html',
})
export class ClassSelectionComponent {
  @Input() classes: Class[] = [];
  @Input() selectedClass: Class | undefined;

  @Output() classChange = new EventEmitter<Class>();
}