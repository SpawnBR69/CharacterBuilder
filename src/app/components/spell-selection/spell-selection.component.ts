import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Spell } from '../../model/spell.model';

@Component({
  selector: 'app-spell-selection',
  templateUrl: './spell-selection.component.html',
})
export class SpellSelectionComponent implements OnChanges {
  @Input() innateSpells: Spell[] = [];
  @Input() choiceGroups: { source: string; type: 'TRICK' | 'LEVEL_1'; count: number; options: Spell[] }[] = [];
  @Output() selectionChange = new EventEmitter<Spell[]>();

  // Armazena as seleções por grupo: { '0': [spell1], '1': [spell2, spell3] }
  selectionsByGroup: { [groupIndex: string]: Spell[] } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['choiceGroups']) {
      this.selectionsByGroup = {};
      this.choiceGroups.forEach((_, index) => {
        this.selectionsByGroup[index] = [];
      });
    }
  }

  emitSelection(): void {
    const allChosenSpells = Object.values(this.selectionsByGroup).flat();
    this.selectionChange.emit(allChosenSpells);
  }
  
  getOptionsForGroup(groupIndex: number): Spell[] {
    const currentGroupOptions = this.choiceGroups[groupIndex]?.options || [];
    
    // Cria um Set com os nomes de todas as magias selecionadas em OUTROS grupos.
    const selectedInOtherGroups = new Set<string>();
    Object.entries(this.selectionsByGroup).forEach(([key, spells]) => {
        if (parseInt(key, 10) !== groupIndex) {
            spells.forEach(s => selectedInOtherGroups.add(s.name));
        }
    });

    // Uma magia só pode ser escolhida uma vez no geral.
    return currentGroupOptions.filter(opt => !selectedInOtherGroups.has(opt.name));
  }
}