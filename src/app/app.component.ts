import { Component, OnInit } from '@angular/core';
import { CharacterCreationService } from './service/character-creation.service';
import { Race, Class, Background, AbilityScores, Character, SubRace, Skill } from './model/character.model';
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
    this.resetToInitialState();
  }

  resetToInitialState() {
    this.currentStep = 0;
    this.character = this.createEmptyCharacter();
    this.selectedRace = undefined;
    this.selectedSubrace = undefined;
    this.selectedClass = undefined;
    this.selectedBackground = undefined;

    this.races = this.characterService.getRaces();
    this.classes = this.characterService.getClasses();
    this.backgrounds = this.characterService.getBackgrounds();
    this.initializeAbilityScores();
  }

  createEmptyCharacter(): Partial<Character> {
    return {
      name: '',
      level: 1,
      abilityScores: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      proficiencyBonus: 2, // Para nível 1
      skills: this.initializeSkills(),
      savingThrows: this.initializeSavingThrows(),
      equipment: [],
      traits: [],
    };
  }

  initializeSkills(): { [key: string]: Skill } {
    const allSkills: { name: string; ability: keyof AbilityScores }[] = [
      { name: 'Acrobacia', ability: 'dexterity' }, { name: 'Adestrar Animais', ability: 'wisdom' },
      { name: 'Arcanismo', ability: 'intelligence' }, { name: 'Atletismo', ability: 'strength' },
      { name: 'Enganação', ability: 'charisma' }, { name: 'Furtividade', ability: 'dexterity' },
      { name: 'História', ability: 'intelligence' }, { name: 'Intimidação', ability: 'charisma' },
      { name: 'Intuição', ability: 'wisdom' }, { name: 'Investigação', ability: 'intelligence' },
      { name: 'Medicina', ability: 'wisdom' }, { name: 'Natureza', ability: 'intelligence' },
      { name: 'Percepção', ability: 'wisdom' }, { name: 'Atuação', ability: 'charisma' },
      { name: 'Persuasão', ability: 'charisma' }, { name: 'Prestidigitação', ability: 'dexterity' },
      { name: 'Religião', ability: 'intelligence' }, { name: 'Sobrevivência', ability: 'wisdom' }
    ];
    const skills: { [key: string]: Skill } = {};
    allSkills.forEach(s => {
      skills[s.name] = { ...s, proficient: false };
    });
    return skills;
  }

  initializeSavingThrows(): Character['savingThrows'] {
    const savingThrows: any = {};
    this.abilityKeys.forEach(key => {
      savingThrows[key] = { proficient: false, value: 0 };
    });
    return savingThrows;
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
    if (this.character?.race?.abilityScoreIncrease?.[ability]) { score += this.character.race.abilityScoreIncrease[ability]!; }
    if (this.character?.subrace?.abilityScoreIncrease?.[ability]) { score += this.character.subrace.abilityScoreIncrease[ability]!; }
    return score;
  }

  getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  getAbilityModifierString(score: number): string {
    const mod = this.getAbilityModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  compileCharacterData() {
    const finalCharacter: Character = this.createEmptyCharacter() as Character;
    finalCharacter.name = this.character.name || 'Sem Nome';
    finalCharacter.race = this.selectedRace;
    finalCharacter.subrace = this.selectedSubrace;
    finalCharacter.class = this.selectedClass;
    finalCharacter.background = this.selectedBackground;
    finalCharacter.level = 1;
    finalCharacter.proficiencyBonus = 2;

    // 1. Finaliza os Ability Scores
    this.abilityKeys.forEach(key => {
      finalCharacter.abilityScores[key] = this.getFinalAbilityScore(key);
    });

    // 2. Calcula Saving Throws
    this.abilityKeys.forEach(key => {
      const modifier = this.getAbilityModifier(finalCharacter.abilityScores[key]);
      const isProficient = finalCharacter.class?.savingThrowProficiencies.includes(key) || false;
      finalCharacter.savingThrows[key] = {
        proficient: isProficient,
        value: modifier + (isProficient ? finalCharacter.proficiencyBonus : 0)
      };
    });

    // 3. Calcula Perícias (Skills)
    const backgroundSkills = finalCharacter.background?.skillProficiencies || [];
    // (Adicionar lógica para escolher perícias da classe aqui no futuro)
    for (const skillName in finalCharacter.skills) {
        if(backgroundSkills.includes(skillName)) {
            finalCharacter.skills[skillName].proficient = true;
        }
    }

    // 4. Calcula HP, AC e Iniciativa
    const conModifier = this.getAbilityModifier(finalCharacter.abilityScores.constitution);
    const dexModifier = this.getAbilityModifier(finalCharacter.abilityScores.dexterity);
    finalCharacter.hitPoints = {
      max: (finalCharacter.class?.hitDie || 0) + conModifier,
      current: (finalCharacter.class?.hitDie || 0) + conModifier,
      temporary: 0
    };
    finalCharacter.armorClass = 10 + dexModifier; // Base, sem armadura
    finalCharacter.initiative = dexModifier;
    
    // 5. Compila Equipamentos e Traços
    finalCharacter.equipment = this.characterService.getStartingEquipment(finalCharacter.class?.name, finalCharacter.background?.name);
    finalCharacter.traits = [
      ...(finalCharacter.race?.traits || []),
      ...(finalCharacter.subrace?.traits || []),
      ...(finalCharacter.background?.feature ? [finalCharacter.background.feature.name] : [])
    ];
    
    // Atualiza o personagem principal
    this.character = finalCharacter;
  }
  
  // --- Funções de Importação/Exportação ---

  downloadJson() {
    this.compileCharacterData(); // Garante que os dados estão atualizados
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.character, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${this.character.name?.replace(/\s+/g, '_') || 'personagem'}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  
  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Validação simples do JSON importado
        if (json.name && json.abilityScores) {
          this.character = json;
          this.selectedRace = json.race;
          this.selectedSubrace = json.subrace;
          this.selectedClass = json.class;
          this.selectedBackground = json.background;
          this.assignedScores = json.abilityScores; // Pode precisar de mais lógica se o método de criação for diferente
          this.currentStep = 6; // Pula para o resumo
        } else {
          alert('Arquivo JSON inválido ou não corresponde ao formato de personagem.');
        }
      } catch (error) {
        console.error("Erro ao ler o JSON:", error);
        alert("Ocorreu um erro ao ler o arquivo. Verifique se é um JSON válido.");
      }
    };
    
    reader.readAsText(file);
  }
  
  exportToPdf() {
    alert("Funcionalidade de exportar para PDF editável seria implementada aqui.");
  }
}