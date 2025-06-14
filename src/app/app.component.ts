import { Component, OnInit } from '@angular/core';
import { CharacterCreationService } from './service/character-creation.service';
import { Race, Class, Background, AbilityScores, Character, SubRace, Skill } from './model/character.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDataLoaded = false; // Flag para controlar o carregamento
  // ... (outras propriedades permanecem as mesmas)
  character: Partial<Character> = {};
  currentStep = 0;
  isStepValid = false;
  races: Race[] = [];
  classes: Class[] = [];
  backgrounds: Background[] = [];
  selectedRace?: Race;
  selectedSubrace?: SubRace;
  selectedClass?: Class;
  selectedBackground?: Background;
  assignedScores?: AbilityScores;
  equipmentChoices: { [key: string]: string } = {};
  chosenLanguages: string[] = [];
  skillChoiceGroups: { source: string; count: number; options: string[] }[] = [];
  chosenSkills: { [groupIndex: number]: string[] } = {};
  abilityScoreChoiceInfo: { count: number; amount: number; options: (keyof AbilityScores)[] } | null = null;
  chosenAbilityBonuses: (keyof AbilityScores)[] = [];


  constructor(public characterService: CharacterCreationService) { }

  ngOnInit() {
    this.characterService.loadAllData().subscribe(() => {
        this.isDataLoaded = true;
        this.resetToInitialState();
    });
  }

  resetToInitialState() {
    this.currentStep = 0;
    this.character = this.createEmptyCharacter();
    this.selectedRace = undefined;
    this.selectedSubrace = undefined;
    this.selectedClass = undefined;
    this.selectedBackground = undefined;
    this.assignedScores = { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 };
    this.equipmentChoices = {};
    this.chosenLanguages = [];
    this.skillChoiceGroups = [];
    this.chosenSkills = {};
    
    // Carrega dados do serviço APÓS o carregamento dos JSON
    this.races = this.characterService.getRaces();
    this.classes = this.characterService.getClasses();
    this.backgrounds = this.characterService.getBackgrounds();

    this.abilityScoreChoiceInfo = null;
    this.chosenAbilityBonuses = [];

    this.updateStepValidity();
  }

  // --- NAVEGAÇÃO ---
  nextStep() {
    if (this.currentStep === 5) {
      this.compileCharacterData();
    }
    if (this.currentStep < 6) {
      this.currentStep++;
      this.updateStepValidity();
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateStepValidity();
    }
  }
  
  // --- HANDLERS DE EVENTOS DOS FILHOS ---

  onNameChanged(name: string) {
    this.character.name = name;
    this.updateStepValidity();
  }

  onRaceChanged(race: Race) {
    this.selectedRace = race;
    this.selectedSubrace = undefined; // Reseta a sub-raça ao trocar de raça
    this.updateStepValidity();
    this.recalculateSkillChoices();
    this.recalculateAbilityScoreChoices();
  }

  onAbilityScoreChoicesChanged(choices: (keyof AbilityScores)[]) {
    this.chosenAbilityBonuses = choices;
    this.updateStepValidity(); // Atualiza a validade do passo
  }
  
  // Novo método para calcular as escolhas de atributo
  recalculateAbilityScoreChoices() {
    this.chosenAbilityBonuses = []; // Reseta as escolhas
    if (this.selectedRace?.abilityScoreChoice) {
      const choiceData = this.selectedRace.abilityScoreChoice;
      let options: (keyof AbilityScores)[];

      if (choiceData.options === 'ALL') {
        options = this.getAbilityKeys();
      } else {
        options = choiceData.options;
      }
      
      // Remove atributos que já recebem um bônus fixo da lista de opções
      const fixedBonusKeys = Object.keys(this.selectedRace.abilityScoreIncrease || {});
      options = options.filter(opt => !fixedBonusKeys.includes(opt));

      this.abilityScoreChoiceInfo = {
        count: choiceData.count,
        amount: choiceData.amount,
        options: options
      };
    } else {
      this.abilityScoreChoiceInfo = null;
    }
  }

  onSubraceChanged(subrace: SubRace) {
    this.selectedSubrace = subrace;
    this.updateStepValidity();
    this.recalculateSkillChoices();
  }

  onClassChanged(newClass: Class) {
    this.selectedClass = newClass;
    this.equipmentChoices = {}; // Reseta as escolhas de equipamento
    this.updateStepValidity();
  }
  
  onScoresChanged(scores: AbilityScores) {
    this.assignedScores = scores;
    this.updateStepValidity();
  }

  onBackgroundChanged(background: Background) {
    this.selectedBackground = background;
    this.updateStepValidity();
  }

  onEquipmentChanged(choices: { [key: string]: string }) {
    this.equipmentChoices = choices;
    this.updateStepValidity();
  }

  onStepValidityChanged(isValid: boolean) {
      this.isStepValid = isValid;
  }
  
  // --- LÓGICA DE VALIDAÇÃO ---
  updateStepValidity() {
    switch(this.currentStep) {
      case 0: this.isStepValid = !!this.character.name && this.character.name.trim() !== ''; break;
      case 1:
        const raceIsValid = !!this.selectedRace && (!this.selectedRace.subraces || this.selectedRace.subraces.length === 0 || !!this.selectedSubrace);
        const abilityChoiceIsValid = !this.abilityScoreChoiceInfo || this.chosenAbilityBonuses.filter(c => c).length === this.abilityScoreChoiceInfo.count;
        this.isStepValid = raceIsValid && abilityChoiceIsValid;
        break;
      case 2: this.isStepValid = !!this.selectedClass; break;
      // A validade do passo 3 é gerenciada pelo seu próprio componente via (onStepValidityChanged)
      case 4: this.isStepValid = !!this.selectedBackground; break;
      case 5: this.isStepValid = true; break; // Equipamento é opcional
      default: this.isStepValid = false;
    }
  }


  //Lógica de lingugagens
  get knownLanguages(): string[] {
    const languages = new Set<string>();
    
    this.selectedRace?.languages?.forEach(lang => {
      if (!lang.startsWith('CHOICE:')) {
        languages.add(lang);
      }
    });
    this.selectedSubrace?.languages?.forEach(lang => {
      if (!lang.startsWith('CHOICE:')) {
        languages.add(lang);
      }
    });
    this.selectedBackground?.languages?.forEach(lang => {
      if(!lang.startsWith('CHOICE:')){
        languages.add(lang);
      }
    });

    return Array.from(languages);
  }

  get languageChoicesCount(): number {
    let count = 0;
    const sources = [this.selectedRace, this.selectedSubrace, this.selectedBackground];

    sources.forEach(source => {
      source?.languages?.forEach(lang => {
        if (lang.startsWith('CHOICE:')) {
          count += parseInt(lang.split(':')[1] || '0', 10);
        }
      });
    });

    return count;
  }
  
  get availableLanguagesForSelection(): string[] {
    const allLangs = this.characterService.getAvailableLanguages();
    const known = this.knownLanguages;
    return allLangs.filter(lang => !known.includes(lang));
  }

  onLanguagesChanged(languages: string[]) {
    this.chosenLanguages = languages;
  }

  onSkillChoicesChanged(choices: { [groupIndex: number]: string[] }) {
    this.chosenSkills = choices;
  }

  get fixedSkillProficiencies(): string[] {
    const proficiencies = new Set<string>();

    this.selectedBackground?.skillProficiencies?.forEach(skill => proficiencies.add(skill));
    
    const traits = [
      ...(this.selectedRace?.traits || []),
      ...(this.selectedSubrace?.traits || [])
    ];

    traits.forEach(trait => {
      trait.skillProficiencies?.forEach(prof => {
        if (!prof.startsWith('CHOICE:')) {
          proficiencies.add(prof);
        }
      });
    });

    return Array.from(proficiencies);
  }

  // Este método é chamado sempre que a seleção de raça/classe/etc. muda
  recalculateSkillChoices() {
    const choiceGroups: { source: string; count: number; options: string[] }[] = [];
    const traits = [
      ...(this.selectedRace?.traits || []),
      ...(this.selectedSubrace?.traits || [])
    ];

    traits.forEach(trait => {
      trait.skillProficiencies?.forEach(prof => {
        if (prof.startsWith('CHOICE:')) {
          const parts = prof.split(':');
          const count = parseInt(parts[1] || '0', 10);
          const optionsStr = parts[2];
          const options = optionsStr === 'ALL' ? this.characterService.getAvailableSkills() : optionsStr.split(',');
          
          choiceGroups.push({
            source: trait.name,
            count: count,
            options: options.filter(opt => !this.fixedSkillProficiencies.includes(opt)) // Remove opções já conhecidas
          });
        }
      });
    });

    this.skillChoiceGroups = choiceGroups;
    this.chosenSkills = {}; // Reseta as escolhas ao recalcular
  }


  // --- COMPILAÇÃO E DADOS ---
  compileCharacterData() {
    const finalCharacter: Character = this.createEmptyCharacter() as Character;
    
    finalCharacter.name = this.character.name || 'Sem Nome';
    finalCharacter.race = this.selectedRace;
    finalCharacter.subrace = this.selectedSubrace;
    finalCharacter.class = this.selectedClass;
    finalCharacter.background = this.selectedBackground;
    finalCharacter.level = 1;
    finalCharacter.proficiencyBonus = 2;

    // Traits
    finalCharacter.traits = []; // Inicia o array
    if(this.selectedRace?.traits) {
      finalCharacter.traits.push(...this.selectedRace.traits);
    }
    if(this.selectedSubrace?.traits) {
      finalCharacter.traits.push(...this.selectedSubrace.traits);
    }
    if(this.selectedBackground) {
      finalCharacter.traits.push(this.selectedBackground.feature);
    }

    // Scores
    this.getAbilityKeys().forEach(key => {
      let score = this.assignedScores?.[key] || 0;
      // Aplica bônus fixo da raça
      if (this.selectedRace?.abilityScoreIncrease?.[key]) {
        score += this.selectedRace.abilityScoreIncrease[key]!;
      }
      // Aplica bônus fixo da sub-raça
      if (this.selectedSubrace?.abilityScoreIncrease?.[key]) {
        score += this.selectedSubrace.abilityScoreIncrease[key]!;
      }
      finalCharacter.abilityScores[key] = score;
    });

    // Aplica bônus escolhidos
    if(this.abilityScoreChoiceInfo) {
      this.chosenAbilityBonuses.forEach(abilityKey => {
        if(abilityKey) {
          finalCharacter.abilityScores[abilityKey] += this.abilityScoreChoiceInfo!.amount;
        }
      });
    }

    // Saving Throws
    this.getAbilityKeys().forEach(key => {
      const modifier = this.getAbilityModifier(finalCharacter.abilityScores[key]);
      const isProficient = finalCharacter.class?.savingThrowProficiencies.includes(key) || false;
      finalCharacter.savingThrows[key] = {
        proficient: isProficient,
        value: modifier + (isProficient ? finalCharacter.proficiencyBonus : 0)
      };
    });

    //Skills
    const allSkillProficiencies = new Set<string>(this.fixedSkillProficiencies);
    this.selectedBackground?.skillProficiencies?.forEach(skill => allSkillProficiencies.add(skill));
    Object.values(this.chosenSkills).forEach(groupChoices => {
      groupChoices.forEach(skill => {
        if (skill) allSkillProficiencies.add(skill);
      });
    });

    for (const skillName in finalCharacter.skills) {
      if (allSkillProficiencies.has(skillName)) {
        finalCharacter.skills[skillName].proficient = true;
      }
    }

    // HP, AC, Initiative
    const conModifier = this.getAbilityModifier(finalCharacter.abilityScores.constitution);
    const dexModifier = this.getAbilityModifier(finalCharacter.abilityScores.dexterity);
    finalCharacter.hitPoints = {
      max: (finalCharacter.class?.hitDie || 0) + conModifier,
      current: (finalCharacter.class?.hitDie || 0) + conModifier,
      temporary: 0
    };
    finalCharacter.armorClass = 10 + dexModifier;
    finalCharacter.initiative = dexModifier;
    
    // Equipment
    const finalEquipment: string[] = [];
    if(finalCharacter.class?.startingEquipment) {
        finalCharacter.class.startingEquipment.forEach((item, index) => {
            if(Array.isArray(item)) {
                const choiceKey = `class-choice-${index}`;
                if (this.equipmentChoices[choiceKey]) {
                    finalEquipment.push(this.equipmentChoices[choiceKey]);
                }
            } else {
                finalEquipment.push(item);
            }
        });
    }
    if(finalCharacter.background?.equipment) {
        finalEquipment.push(...finalCharacter.background.equipment);
    }
    finalCharacter.equipment = finalEquipment;

    // Lógica de idiomas
    const finalLanguages = new Set<string>([...this.knownLanguages, ...this.chosenLanguages]);
    finalCharacter.languages = Array.from(finalLanguages);
    
    this.character = finalCharacter;
  }
  
  // --- IMPORT/EXPORT ---
  downloadJson() {
    if (this.currentStep < 6) {
      this.compileCharacterData();
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.character, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${(this.character.name || 'personagem').replace(/\s+/g, '_')}.json`);
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
        const importedChar = JSON.parse(e.target?.result as string) as Character;
        if (!importedChar.name || !importedChar.class || !importedChar.race || !importedChar.background || !importedChar.abilityScores) {
          throw new Error('Arquivo JSON incompleto ou em formato incorreto.');
        }

        // Atualiza o estado principal com os dados importados
        this.character = importedChar;
        this.selectedRace = this.races.find(r => r.name === importedChar.race?.name);
        this.selectedSubrace = this.selectedRace?.subraces?.find(sr => sr.name === importedChar.subrace?.name);
        this.selectedClass = this.classes.find(c => c.name === importedChar.class?.name);
        this.selectedBackground = this.backgrounds.find(b => b.name === importedChar.background?.name);
        this.assignedScores = importedChar.abilityScores;
        this.equipmentChoices = {}; // Nota: A escolha de equipamento não é salva no JSON, pode ser uma melhoria futura.

        this.currentStep = 6;
      } catch (error) {
        console.error("Erro ao importar JSON:", error);
        alert("Ocorreu um erro ao ler o arquivo. Verifique se é um JSON válido e completo.");
      }
    };
    reader.readAsText(file);
  }

  // --- MÉTODOS AUXILIARES ---
  createEmptyCharacter(): Partial<Character> {
    return {
      name: '',
      level: 1,
      abilityScores: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
      proficiencyBonus: 2,
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
    this.getAbilityKeys().forEach(key => {
      savingThrows[key] = { proficient: false, value: 0 };
    });
    return savingThrows;
  }

  getAbilityKeys = (): (keyof AbilityScores)[] => ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  getAbilityModifier = (score: number) => Math.floor((score - 10) / 2);
}
