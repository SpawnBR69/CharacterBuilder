import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Race, SubRace } from '../../model/character.model';

@Component({
  selector: 'app-race-selection',
  templateUrl: './race-selection.component.html',
})
export class RaceSelectionComponent {
  @Input() races: Race[] = [];
  @Input() selectedRace: Race | undefined;
  @Input() selectedSubrace: SubRace | undefined;

  @Output() raceChange = new EventEmitter<Race>();
  @Output() subraceChange = new EventEmitter<SubRace>();

  formatLanguageDisplay(lang: string): string {
    if (lang.startsWith('CHOICE:')) {
      const count = lang.split(':')[1];
      const plural = parseInt(count, 10) > 1 ? 's' : '';
      return `${count} idioma${plural} à sua escolha`;
    }
    return lang;
  }
}
