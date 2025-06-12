import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Class, Background } from '../../model/character.model';

@Component({
  selector: 'app-equipment-selection',
  templateUrl: './equipment-selection.component.html',
})
export class EquipmentSelectionComponent {
  @Input() selectedClass: Class | undefined;
  @Input() selectedBackground: Background | undefined;
  @Input() equipmentChoices: { [key: string]: string } = {};

  @Output() equipmentChange = new EventEmitter<{ [key: string]: string }>();

  isEquipmentChoice(item: any): item is string[] {
    return Array.isArray(item);
  }

  onChoiceChange() {
    this.equipmentChange.emit(this.equipmentChoices);
  }
}