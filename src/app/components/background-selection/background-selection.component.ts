import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Background } from '../../model/character.model';

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
  
  @Output() backgroundChange = new EventEmitter<Background>();
  // Novo Output para idiomas
  @Output() languagesChange = new EventEmitter<string[]>();

  selectedBonusLanguages: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    // Reseta as escolhas se o número de opções mudar
    if (changes['languageChoicesCount']) {
      this.selectedBonusLanguages = new Array(this.languageChoicesCount).fill(null);
    }
  }

  onLanguageSelectionChange() {
    // Filtra valores nulos e emite apenas as seleções válidas
    this.languagesChange.emit(this.selectedBonusLanguages.filter(lang => lang));
  }
  
  // Filtra as opções para cada dropdown, evitando duplicatas
  getOptionsForDropdown(index: number): string[] {
    const selectedInOtherDropdowns = this.selectedBonusLanguages
      .filter((_, i) => i !== index && this.selectedBonusLanguages[i]);
      
    return this.availableLanguages.filter(lang => !selectedInOtherDropdowns.includes(lang));
  }

  // Necessário para o *ngFor no template
  counter(i: number) {
    return new Array(i);
  }
}