import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Background } from '../../model/character.model';
import { TranslationService } from '../../service/translation.service';

@Component({
  selector: 'app-background-selection',
  templateUrl: './background-selection.component.html',
})
export class BackgroundSelectionComponent implements OnChanges {
  @Input() backgrounds: Background[] = [];
  @Input() selectedBackground: Background | undefined;
  
  // Novos Inputs para idiomas
  @Input() knownLanguages: string[] = [];
  @Input() languageChoicesCount = 0;
  @Input() availableLanguages: string[] = [];

  @Input() fixedSkillProficiencies: string[] = [];
  @Input() skillChoiceGroups: { source: string; count: number; options: string[] }[] = [];
  
  @Output() backgroundChange = new EventEmitter<Background>();
  // Novo Output para idiomas
  @Output() languagesChange = new EventEmitter<string[]>();
  @Output() skillChoicesChange = new EventEmitter<{ [groupIndex: number]: string[] }>();

  selectedBonusLanguages: string[] = [];
  selectedBonusSkills: { [groupIndex: number]: string[] } = {};

  constructor(private translationService: TranslationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Reseta as escolhas se o número de opções mudar
    if (changes['languageChoicesCount']) {
      this.selectedBonusLanguages = new Array(this.languageChoicesCount).fill(null);
    }

    if (changes['skillChoiceGroups']) {
      this.selectedBonusSkills = {};
      this.skillChoiceGroups.forEach((group, index) => {
        this.selectedBonusSkills[index] = new Array(group.count).fill(null);
      });
    }
  }

  onLanguageSelectionChange() {
    // Filtra valores nulos e emite apenas as seleções válidas
    this.languagesChange.emit(this.selectedBonusLanguages.filter(lang => lang));
  }

  getSkillDisplayName(skillName: string): string {
    const abilityKey = this.translationService.getAbilityForSkill(skillName);
    if (!abilityKey) {
      return skillName; // Retorna só o nome se não encontrar a habilidade
    }
    const abilityAbbr = this.translationService.getAbilityTranslation(abilityKey).abbr;
    return `${skillName} (${abilityAbbr})`;
  }
  
  // Filtra as opções para cada dropdown, evitando duplicatas
  getOptionsForDropdown(index: number): string[] {
    const selectedInOtherDropdowns = this.selectedBonusLanguages
      .filter((_, i) => i !== index && this.selectedBonusLanguages[i]);
      
    return this.availableLanguages.filter(lang => !selectedInOtherDropdowns.includes(lang));
  }

  onSkillSelectionChange() {
    this.skillChoicesChange.emit(this.selectedBonusSkills);
  }

  getSkillOptionsForGroup(groupIndex: number, dropdownIndex: number) {
    const group = this.skillChoiceGroups[groupIndex];
    if (!group) return [];

    const selectedInThisGroup = (this.selectedBonusSkills[groupIndex] || [])
      .filter((_, i) => i !== dropdownIndex);

    const selectedInOtherGroups = Object.keys(this.selectedBonusSkills)
      .filter(key => parseInt(key, 10) !== groupIndex)
      .flatMap(key => this.selectedBonusSkills[parseInt(key, 10)]);

    const allSelected = new Set([...selectedInThisGroup, ...selectedInOtherGroups, ...this.fixedSkillProficiencies]);

    const availableOptions = group.options.filter(opt => !allSelected.has(opt));

    // Transforma a lista de strings em uma lista de objetos para o p-dropdown
    return availableOptions.map(skillName => ({
      label: this.getSkillDisplayName(skillName), // Ex: "Arcanismo (INT)"
      value: skillName                         // Ex: "Arcanismo"
    }));
  }
  
  formatLanguageDisplay(lang: string): string {
    if (lang.startsWith('CHOICE:')) {
      const count = lang.split(':')[1];
      const plural = parseInt(count, 10) > 1 ? 's' : '';
      return `${count} idioma${plural} à sua escolha`;
    }
    return lang;
  }

  // Necessário para o *ngFor no template
  counter(i: number) {
    return new Array(i);
  }
}