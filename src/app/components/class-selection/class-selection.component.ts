import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Class } from '../../model/character.model';
import { TranslationService } from '../../service/translation.service';
import { AbilityScores } from '../../model/character.model';

@Component({
  selector: 'app-class-selection',
  templateUrl: './class-selection.component.html',
})
export class ClassSelectionComponent {
  @Input() classes: Class[] = [];
  @Input() selectedClass: Class | undefined;

  @Output() classChange = new EventEmitter<Class>();

  constructor(private translationService: TranslationService) {}

  public getAbilityTranslation(ability: keyof AbilityScores) {
    return this.translationService.getAbilityTranslation(ability);
  }
}