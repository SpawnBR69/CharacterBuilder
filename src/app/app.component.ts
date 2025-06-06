import { Component, OnInit } from '@angular/core';
import { CharacterCreationService } from './service/character-creation.service';
import { Race, Class, Background, AbilityScores, Character, SubRace } from './model/character.model';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  character: Partial<Character> = { name: '' }; // Inicializa com nome vazio
  currentStep = 0; // Começa no passo 0

  // Opções para seleção
  races: Race[] = [];
  selectedRace?: Race;
  selectedSubrace?: SubRace; 

  classes: Class[] = [];
  selectedClass?: Class;

  backgrounds: Background[] = [];
  selectedBackground?: Background;

  abilityScoreMethod: 'roll' | 'standard' | 'pointbuy' = 'standard';
  rolledScores: number[] = [];
  standardArray: number[] = [15, 14, 13, 12, 10, 8];
  abilityScorePool: number[] = [];
  
  assignedScores: AbilityScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
  pointBuyPoints = 27;
  
  abilityKeys: (keyof AbilityScores)[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];


  constructor(public characterService: CharacterCreationService) {} 

  ngOnInit() {
    this.characterService.currentCharacter.subscribe(char => this.character = char);
    this.races = this.characterService.getRaces();
    this.classes = this.characterService.getClasses();
    this.backgrounds = this.characterService.getBackgrounds();
    this.initializeAbilityScores();
  }

  initializeAbilityScores() {
    this.assignedScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    this.abilityScorePool = [];
    this.rolledScores = []; // Limpa as rolagens anteriores

    if (this.abilityScoreMethod === 'pointbuy') {
      this.assignedScores = { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 };
      this.recalculatePointBuyPoints();
    } else if (this.abilityScoreMethod === 'standard') {
      this.abilityScorePool = [...this.characterService.getStandardArray()];
    }
  }

  // Funções de Navegação
  nextStep() {
    if (this.currentStep === 0) {
      this.characterService.updateCharacter({ name: this.character.name });
    }
    if (this.currentStep === 3) {
        const finalScores = { ...this.assignedScores };
        this.characterService.updateCharacter({ abilityScores: finalScores });
    }
    if (this.currentStep === 5) { 
        const startingEquipment = this.characterService.getStartingEquipment(this.character.class?.name, this.character.background?.name);
        this.character.equipment = startingEquipment;
        this.characterService.updateCharacter({ equipment: startingEquipment });
    }
    this.currentStep++;
  }
  prevStep() { this.currentStep--; }

  onRaceSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const raceName = selectElement.value;
    
    // Encontra a raça completa pelo nome e reseta as seleções
    this.selectedRace = this.races.find(r => r.name === raceName);
    this.selectedSubrace = undefined;
    
    // Atualiza o personagem no serviço
    if (this.selectedRace) {
      // Se a raça não tem sub-raças, a seleção está completa
      if (!this.selectedRace.subraces || this.selectedRace.subraces.length === 0) {
        this.characterService.updateCharacter({ race: this.selectedRace, subrace: undefined });
      } else {
        // Se tem sub-raças, atualiza a raça principal mas aguarda a seleção da sub-raça
        this.characterService.updateCharacter({ race: this.selectedRace, subrace: undefined });
      }
    } else {
      // Se a seleção for limpa ("-- Escolha uma Raça --")
      this.characterService.updateCharacter({ race: undefined, subrace: undefined });
    }
  }

  onSubraceSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const subraceName = selectElement.value;

    if (this.selectedRace?.subraces) {
      this.selectedSubrace = this.selectedRace.subraces.find(sr => sr.name === subraceName);
      // Atualiza o personagem no serviço com a sub-raça
      this.characterService.updateCharacter({ subrace: this.selectedSubrace });
    }
  }

  onClassSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const className = selectElement.value;
    this.selectedClass = this.classes.find(c => c.name === className);
    this.characterService.updateCharacter({ class: this.selectedClass });
  }

  onBackgroundSelected(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const backgroundName = selectElement.value;
    this.selectedBackground = this.backgrounds.find(b => b.name === backgroundName);
    this.characterService.updateCharacter({ background: this.selectedBackground });
  }

  // Lógica de Valores de Habilidade
  onRollScores() {
    this.rolledScores = this.characterService.rollAbilityScores();
    this.resetScoreAssignments(); // Chama a função de reset para popular o pool
    alert(`Scores rolados: ${this.rolledScores.join(', ')}\nPor favor, distribua-os abaixo.`);
  }

  resetScoreAssignments() {
    this.assignedScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    if(this.abilityScoreMethod === 'standard') {
      this.abilityScorePool = [...this.characterService.getStandardArray()];
    } else if (this.abilityScoreMethod === 'roll' && this.rolledScores.length > 0) {
      this.abilityScorePool = [...this.rolledScores];
    }
  }

  recalculatePointBuyPoints() {
    let totalCost = 0;
    for (const abilityKey of this.abilityKeys) { 
        totalCost += this.characterService.calculatePointBuyCost(this.assignedScores[abilityKey]);
    }
    this.pointBuyPoints = 27 - totalCost;
  }

  getAvailableScoresFor(currentAbility: keyof AbilityScores): number[] {
    const currentlyAssignedScore = this.assignedScores[currentAbility];
    
    // Pega todos os scores atribuídos a OUTRAS habilidades
    const otherAssignedScores = this.abilityKeys
      .filter(key => key !== currentAbility)
      .map(key => this.assignedScores[key])
      .filter(score => score > 0); 

    // Cria uma cópia do pool original para poder manipular
    const tempPool = [...this.abilityScorePool];

    // Para cada score já atribuído a outra habilidade, remove UMA ocorrência dele do pool temporário
    for(const score of otherAssignedScores) {
      const indexToRemove = tempPool.indexOf(score);
      if (indexToRemove !== -1) {
        tempPool.splice(indexToRemove, 1);
      }
    }
    
    // O pool temporário agora contém apenas os scores realmente disponíveis.
    // Usamos Set para remover duplicatas para a lista de opções, mas a lógica acima já cuidou da contagem.
    const available = [...new Set(tempPool)];
    
    // Garante que o valor atualmente selecionado para ESTA habilidade sempre apareça na lista,
    // para que a seleção não fique em branco.
    if (currentlyAssignedScore > 0 && !available.includes(currentlyAssignedScore)) {
      available.push(currentlyAssignedScore);
    }
    
    return available.sort((a, b) => b - a);
  }
  
  get isNextStepInStep3Disabled(): boolean {
    if (this.abilityScoreMethod === 'pointbuy') {
      return this.pointBuyPoints !== 0;
    } else {
      if (this.abilityScorePool.length === 0) return true;
      const assignedCount = this.abilityKeys.filter(key => this.assignedScores[key] > 0).length;
      return assignedCount < 6;
    }
  }

  getFinalAbilityScore(ability: keyof AbilityScores): number {
    let score = this.assignedScores[ability] || 0; 
    
    if (this.character?.race?.abilityScoreIncrease?.[ability]) {
        score += this.character.race.abilityScoreIncrease[ability]!;
    }
    
    if (this.character?.subrace?.abilityScoreIncrease?.[ability]) {
        score += this.character.subrace.abilityScoreIncrease[ability]!;
    }
    return score;
  }

  getAbilityModifier(score: number | undefined): string {
    if (score === undefined) return '+0';
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }
  
  exportToPdf() {
    alert("Funcionalidade de exportar para PDF editável seria implementada aqui.");
  }
}