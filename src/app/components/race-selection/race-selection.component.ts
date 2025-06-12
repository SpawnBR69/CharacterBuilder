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
}
