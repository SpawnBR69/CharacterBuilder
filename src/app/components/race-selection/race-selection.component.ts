import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Race, SubRace, AbilityScores } from '../../model/character.model';
import { SimpleChanges } from '@angular/core';
import { TranslationService } from '../../service/translation.service';

@Component({
  selector: 'app-race-selection',
  templateUrl: './race-selection.component.html',
})
export class RaceSelectionComponent {
  @Input() races: Race[] = [];
  @Input() selectedRace: Race | undefined;
  @Input() selectedSubrace: SubRace | undefined;
  @Input() abilityScoreChoiceInfo: { count: number; amount: number; options: (keyof AbilityScores)[] } | null = null;
  
  @Output() abilityScoreChoicesChange = new EventEmitter<(keyof AbilityScores)[]>();
  @Output() raceChange = new EventEmitter<Race>();
  @Output() subraceChange = new EventEmitter<SubRace>();

  selectedBonusAbilities: (keyof AbilityScores)[] = [];

  constructor(private translationService: TranslationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['abilityScoreChoiceInfo'] && this.abilityScoreChoiceInfo) {
      this.selectedBonusAbilities = new Array(this.abilityScoreChoiceInfo.count).fill(null);
    }
  }

  onAbilitySelectionChange() {
    this.abilityScoreChoicesChange.emit(this.selectedBonusAbilities);
  }

  getAbilityOptionsForDropdown(index: number) {
    if (!this.abilityScoreChoiceInfo) return [];
    
    const selectedInOtherDropdowns = this.selectedBonusAbilities.filter((_, i) => i !== index);
    const availableOptions = this.abilityScoreChoiceInfo.options.filter(opt => !selectedInOtherDropdowns.includes(opt));
    
    // Mapeia as chaves para o formato { name, key } para o p-dropdown
    return availableOptions.map(key => ({
      key: key,
      name: this.getAbilityTranslation(key).name
    }));
  }

  public getAbilityTranslation(ability: string) {
    return this.translationService.getAbilityTranslation(ability as keyof AbilityScores);
  }
  
  counter(i: number) {
    return new Array(i);
  }

  formatLanguageDisplay(lang: string): string {
    if (lang.startsWith('CHOICE:')) {
      const count = lang.split(':')[1];
      const plural = parseInt(count, 10) > 1 ? 's' : '';
      return `${count} idioma${plural} à sua escolha`;
    }
    return lang;
  }
}
