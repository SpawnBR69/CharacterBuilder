import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Class, Background, EquipmentChoiceOption } from '../../model/character.model';

@Component({
  selector: 'app-equipment-selection',
  templateUrl: './equipment-selection.component.html',
})
export class EquipmentSelectionComponent {
  @Input() selectedClass: Class | undefined;
  @Input() selectedBackground: Background | undefined;
  @Input() equipmentChoices: { [key: string]: string } = {};
  @Input() equipmentChoiceGroups: any[] = [];
  @Input() fixedEquipment: string[] = [];
  @Input() subChoiceGroups: any[] = [];
  @Input() additionalFixedItems: string[] = [];

  @Output() equipmentChange = new EventEmitter<{ [key: string]: string }>();

  isChoiceGroup(item: any): item is EquipmentChoiceOption[] {
    return Array.isArray(item);
  }

  isString(value: any): value is string {
    return typeof value === 'string';
  }

  /**
   * MODIFICADO: O tipo de retorno agora é um "Type Guard" (item is string[]).
   * Isso informa ao TypeScript que, se a função retornar true, 'item' é um array de strings.
   */
  isSimpleChoiceGroup(item: any): item is string[] {
    return Array.isArray(item) && item.every(option => typeof option === 'string');
  }

  onRadioClick(groupId: string, optionValue: string) {
    // 1. Garante que o modelo local é atualizado com o valor correto
    this.equipmentChoices[groupId] = optionValue;
    // 2. Emite a mudança para o componente pai COM o modelo já atualizado
    this.emitChanges();
  }

  emitChanges() {
    this.equipmentChange.emit(this.equipmentChoices);
  }
}