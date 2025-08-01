import { Component, OnInit } from '@angular/core';
import { CharacterCreationService } from './service/character-creation.service';
import { Race, Class, Background, AbilityScores, Character, SubRace, Skill, EquipmentChoiceOption, EquipmentItem } from './model/character.model';
import { SpellService } from './service/spell.service';
import { Spell } from './model/spell.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDataLoaded = false;
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
  chosenSpells: Spell[] = [];
  spellChoiceGroups: { source: string; type: 'TRICK' | 'LEVEL_1'; count: number; options: Spell[] }[] = [];
  equipmentChoiceGroups: any[] = [];
  fixedEquipment: string[] = [];
  subChoiceGroups: any[] = [];
  additionalFixedItems: string[] = [];


  constructor(public characterService: CharacterCreationService, private spellService: SpellService) { }

  ngOnInit() {
    this.characterService.loadAllData().subscribe(() => {
        this.isDataLoaded = true;
        this.resetToInitialState();
    });
  }
  updateAndSetSpellChoices() {
    this.chosenSpells = []; // Reseta as magias escolhidas
    this.innateSpells = this.recalculateInnateSpells();
    this.spellChoiceGroups = this.recalculateSpellChoiceGroups();
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
    if (this.currentStep === 6) { // Agora a compilação é no passo 6
      this.compileCharacterData();
    }
    if (this.currentStep < 7) { // O total de passos agora é 7
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

  innateSpells: Spell[] = [];

  private recalculateInnateSpells(): Spell[] {
    const spellNames = new Set<string>();
    const allTraits = [...(this.selectedRace?.traits || []), ...(this.selectedSubrace?.traits || [])];
    
    allTraits.forEach(trait => {
      trait.spells?.known.forEach(spellName => {
        if (!spellName.startsWith('CHOICE:')) {
          spellNames.add(spellName);
        }
      });
    });

    return this.spellService.getAllSpells().filter(s => spellNames.has(s.name));
  }

  private recalculateSpellChoiceGroups(): { source: string; type: 'TRICK' | 'LEVEL_1'; count: number; options: Spell[] }[] {
    const groups: { source: string; type: 'TRICK' | 'LEVEL_1'; count: number; options: Spell[] }[] = [];
    const allSpells = this.spellService.getAllSpells();

    // Cache filtered spells to avoid repeated filtering
    const allCantrips = allSpells.filter(s => s.level === 0);
    const allLevel1Spells = allSpells.filter(s => s.level === 1);

    // 1. Escolhas de Traços Raciais
    const allTraits = [...(this.selectedRace?.traits || []), ...(this.selectedSubrace?.traits || [])];
    allTraits.forEach(trait => {
      trait.spells?.known.forEach(spellIdentifier => {
        if (spellIdentifier.startsWith('CHOICE:')) {
          const [, type, fromClass, countStr] = spellIdentifier.split(':');
          const count = parseInt(countStr, 10);
          
          if (type === 'TRICK') {
            groups.push({
              source: `Traço: ${trait.name}`,
              type: 'TRICK',
              count: count,
              options: allCantrips.filter(s => s.classes.includes(fromClass))
            });
          }
        }
      });
    });

    // 2. Escolhas de Classe
    if (this.selectedClass?.spellcasting) {
      const classInfo = this.selectedClass.spellcasting;
      
      if (classInfo.cantrips_known > 0) {
        groups.push({
          source: `Classe: ${this.selectedClass.name}`,
          type: 'TRICK',
          count: classInfo.cantrips_known,
          options: allCantrips.filter(s => s.classes.includes(this.selectedClass!.name))
        });
      }
      if (classInfo.spells_known > 0) {
        groups.push({
          source: `Classe: ${this.selectedClass.name}`,
          type: 'LEVEL_1',
          count: classInfo.spells_known,
          options: allLevel1Spells.filter(s => s.classes.includes(this.selectedClass!.name))
        });
      }
      // Lógica para Clérigo/Druida que PREPARAM magias
      if (classInfo.spells_known === -1) {
         const preparedCount = (this.getAbilityModifier(this.assignedScores![classInfo.ability]) || 0) + 1;
         groups.push({
          source: `Classe: ${this.selectedClass.name}`,
          type: 'LEVEL_1',
          count: preparedCount > 0 ? preparedCount : 1,
          options: allLevel1Spells.filter(s => s.classes.includes(this.selectedClass!.name))
        });
      }
    }
    
    return groups;
  }

  onSpellSelectionChanged(spells: Spell[]) {
    this.chosenSpells = spells;
    this.updateStepValidity();
  }
  
  recalculateEquipmentChoices() {
    const groups: any[] = [];
    const fixed: string[] = [];
    this.equipmentChoices = {};

    if (!this.selectedClass) {
        this.equipmentChoiceGroups = [];
        this.fixedEquipment = [];
        return;
    }

    let dynamicChoiceCounter = 0;

    this.selectedClass.startingEquipment.forEach((item, index) => {
        if (Array.isArray(item)) {
            const choiceGroupId = `class-choice-${index}`;
            const containsComplexChoice = item.some(opt => typeof opt === 'object' && opt !== null);

            if (containsComplexChoice) {
                const simpleOptions = item.filter((opt): opt is string => typeof opt === 'string');
                
                // =================== INÍCIO DA CORREÇÃO ===================
                // 1. Encontra o objeto sem a checagem de tipo problemática.
                const weaponChoiceDefinition = item.find(opt => typeof opt === 'object' && opt !== null && 'category' in opt);

                let dynamicWeaponOptions: string[] = [];
                // 2. Usa um 'if' simples, que o TypeScript entende, para garantir que é um objeto antes de acessar '.category'.
                if (weaponChoiceDefinition && typeof weaponChoiceDefinition === 'object') {
                    const weapons = this.characterService.getWeaponsByCategory(weaponChoiceDefinition.category);
                    dynamicWeaponOptions = weapons.map(w => w.name);
                }
                // ==================== FIM DA CORREÇÃO =====================

                groups.push({
                    id: choiceGroupId,
                    label: `Escolha de Equipamento ${index + 1}`,
                    displayAs: 'dropdown',
                    options: [...simpleOptions, ...dynamicWeaponOptions]
                });

            } else {
                groups.push({
                    id: choiceGroupId,
                    label: `Escolha de Equipamento ${index + 1}`,
                    displayAs: 'radio',
                    options: item as string[]
                });
            }
        }
        else if (typeof item === 'string') {
            let remainingString = item;
            const choicePatterns = [
                { pattern: /(uma|duas)\s+armas\s+marciais/i, category: 'martial', quantity: (match: string) => match.toLowerCase().includes('duas') ? 2 : 1 },
                { pattern: /(uma|duas)\s+armas\s+corpo a corpo simples/i, category: 'simple_melee', quantity: (match: string) => match.toLowerCase().includes('duas') ? 2 : 1 },
                { pattern: /qualquer\s+arma\s+simples/i, category: 'simple', quantity: () => 1 },
            ];

            let choiceFoundInString = false;
            for (const p of choicePatterns) {
                const match = remainingString.match(p.pattern);
                if (match) {
                    choiceFoundInString = true;
                    const quantity = p.quantity(match[0]);
                    for (let i = 0; i < quantity; i++) {
                        const choiceId = `class-dynamic-choice-${dynamicChoiceCounter++}`;
                        const weaponList = this.characterService.getWeaponsByCategory(p.category);
                        groups.push({
                            id: choiceId,
                            label: `Escolha - Arma ${p.category.charAt(0).toUpperCase() + p.category.slice(1)} (${i + 1}/${quantity})`,
                            displayAs: 'dropdown',
                            options: weaponList.map(w => w.name)
                        });
                    }
                    remainingString = remainingString.replace(p.pattern, '').trim();
                }
            }
            if (remainingString.length > 0) {
                fixed.push(remainingString.replace(/^(e|,)\s*/, ''));
            }
        }
    });

    this.equipmentChoiceGroups = groups;
    this.fixedEquipment = fixed;
}

  onNameChanged(name: string) {
    this.character.name = name;
    this.updateStepValidity();
  }

  onRaceChanged(race: Race) {
    this.selectedRace = race;
    this.selectedSubrace = undefined; // Reseta a sub-raça ao trocar de raça
    this.updateAndSetSpellChoices();
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
    this.updateAndSetSpellChoices();
    this.updateStepValidity();
    this.recalculateSkillChoices();
  }

  onClassChanged(newClass: Class) {
    this.selectedClass = newClass;
    this.equipmentChoices = {}; 
    this.subChoiceGroups = [];
    this.additionalFixedItems = [];
    this.updateAndSetSpellChoices();
    this.recalculateSkillChoices();
    this.recalculateEquipmentChoices();
    this.updateStepValidity();
  }
  
  onScoresChanged(scores: AbilityScores) {
    this.assignedScores = scores;
    if (this.selectedClass?.spellcasting?.spells_known === -1) {
      this.updateAndSetSpellChoices(); // <-- Adicionar chamada
    }
    this.updateStepValidity();
  }

  onBackgroundChanged(background: Background) {
    this.selectedBackground = background;
    this.updateStepValidity();
  }

  onEquipmentChanged(choices: { [key: string]: string }) {
    this.equipmentChoices = choices;
    // Reseta os itens gerados dinamicamente a cada mudança
    this.subChoiceGroups = [];
    this.additionalFixedItems = [];
    let dynamicChoiceCounter = 0;

    const createDropdown = (category: string, label: string) => {
        const choiceId = `sub-choice-${category}-${dynamicChoiceCounter++}`;
        const weaponList = this.characterService.getWeaponsByCategory(category);
        this.subChoiceGroups.push({
            id: choiceId,
            label: label,
            displayAs: 'dropdown',
            options: weaponList.map(w => w.name)
        });
    };

    // Analisa o valor de cada escolha principal feita
    Object.values(choices).forEach(value => {
        if (!value) return;

        // Caso: "duas armas marciais"
        if (value.toLowerCase().includes('duas armas marciais')) {
            createDropdown('martial', 'Escolha - Arma Marcial (1/2)');
            createDropdown('martial', 'Escolha - Arma Marcial (2/2)');
        }
        // Caso: "uma arma marcial e um escudo"
        else if (value.toLowerCase().includes('uma arma marcial e um escudo')) {
            createDropdown('martial', 'Escolha - Arma Marcial');
            this.additionalFixedItems.push('Escudo'); // Adiciona o item extra
        }
        // Adicione outros 'else if' para mais escolhas complexas aqui
    });

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
      case 5: 
        if (!this.selectedClass) {
          this.isStepValid = false;
          break;
        }

        // =================== INÍCIO DA CORREÇÃO ===================
        // A contagem de escolhas necessárias agora inclui os grupos iniciais E os sub-grupos dinâmicos.
        const totalRequiredChoices = this.equipmentChoiceGroups.length + this.subChoiceGroups.length;
        
        // Conta quantas escolhas foram de fato feitas pelo usuário.
        const madeChoiceCount = Object.keys(this.equipmentChoices).filter(key => this.equipmentChoices[key]).length;

        // O passo só é válido se o número de escolhas feitas for igual ao total necessário.
        this.isStepValid = madeChoiceCount === totalRequiredChoices;
        // ==================== FIM DA CORREÇÃO =====================
        break;
      case 6: // Validação do passo de magia
        if (this.spellChoiceGroups.length === 0) {
            this.isStepValid = true; // Se não há escolhas a fazer, o passo é válido
            break;
        }
        
        // Verifica se todas as escolhas foram feitas
        const totalChoicesNeeded = this.spellChoiceGroups.reduce((acc, group) => acc + group.count, 0);
        const totalChoicesMade = this.chosenSpells.length;

        this.isStepValid = totalChoicesMade === totalChoicesNeeded;
        break;
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

    // Lógica existente para traços raciais...
    traits.forEach(trait => {
      trait.skillProficiencies?.forEach(prof => {
        if (prof.startsWith('CHOICE:')) {
          const parts = prof.split(':');
          const count = parseInt(parts[1] || '0', 10);
          const optionsStr = parts[2];
          const options = optionsStr === 'ALL' ? this.characterService.getAvailableSkills() : optionsStr.split(',');
          
          // Filtra opções de traços contra perícias já conhecidas
          const availableTraitOptions = options.filter(opt => !this.fixedSkillProficiencies.includes(opt));
          
          choiceGroups.push({
            source: `Traço: ${trait.name}`,
            count: count,
            options: availableTraitOptions
          });
        }
      });
    });

    // ===== LÓGICA ATUALIZADA PARA PERÍCIAS DA CLASSE =====
    if (this.selectedClass?.skillChoices) {
      const classSkillOptions = this.selectedClass.skillChoices.options;

      // Filtra as opções da classe contra as perícias que o personagem já possui de forma fixa
      const availableClassSkills = classSkillOptions.filter(opt => !this.fixedSkillProficiencies.includes(opt));

      choiceGroups.push({
        source: `Classe: ${this.selectedClass.name}`,
        count: this.selectedClass.skillChoices.count,
        options: availableClassSkills // Usa a lista já filtrada
      });
    }
    // ===============================================

    this.skillChoiceGroups = choiceGroups;
    this.chosenSkills = {}; // Reseta as escolhas ao recalcular
  }


  // --- COMPILAÇÃO E DADOS ---
  compileCharacterData() {
    const finalCharacter: Character = this.createEmptyCharacter() as Character;
    
    finalCharacter.name = this.character.name || 'Sem Nome';
    finalCharacter.race = this.selectedRace;
    finalCharacter.subrace = this.selectedSubrace;
    if(finalCharacter.subrace && finalCharacter.race && finalCharacter.subrace.speed && finalCharacter.race.speed){
       finalCharacter.race.speed += finalCharacter.subrace.speed;
    }
    finalCharacter.class = this.selectedClass;
    finalCharacter.background = this.selectedBackground;
    finalCharacter.level = 1;
    finalCharacter.proficiencyBonus = 2;

    // Traits
    finalCharacter.traits = []; // Inicia o array
    finalCharacter.traits = [];
    if(this.selectedRace?.traits) finalCharacter.traits.push(...this.selectedRace.traits);
    if(this.selectedSubrace?.traits) finalCharacter.traits.push(...this.selectedSubrace.traits);
    if(this.selectedBackground) finalCharacter.traits.push(this.selectedBackground.feature);
    if(this.selectedClass?.features) finalCharacter.traits.push(...this.selectedClass.features);

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
    let finalArmorClass: number;

    // 1. Procura por um traço que defina um cálculo especial de CA
    const customACCalculationTrait = finalCharacter.traits.find(trait => trait.acCalculation);

    if (customACCalculationTrait && customACCalculationTrait.acCalculation) {
      // 2. Se um traço especial for encontrado, usa a fórmula dele
      const calcData = customACCalculationTrait.acCalculation;
      let totalModifier = 0;
      // Soma os modificadores de todos os atributos listados no traço
      calcData.attributes.forEach(attrKey => {
        const modifier = this.getAbilityModifier(finalCharacter.abilityScores[attrKey]);
        totalModifier += modifier;
      });
      // A CA final é a base do traço + a soma dos modificadores
      finalArmorClass = calcData.base + totalModifier;

    } else {
      // 3. Se nenhum traço especial for encontrado, usa o cálculo padrão
      //    (No futuro, aqui entraria a lógica de armadura equipada)
      finalArmorClass = 10 + dexModifier;
    }
    
    finalCharacter.armorClass = finalArmorClass;
    finalCharacter.initiative = dexModifier;
    
    // Equipment
    const finalEquipmentList: string[] = [];

    // 1. DEFINIMOS QUAIS STRINGS SÃO APENAS "GATILHOS" E DEVEM SER IGNORADAS
    const choiceTriggerStrings = [
        'duas armas marciais',
        'uma arma marcial e um escudo',
        'duas armas corpo a corpo simples',
        'qualquer arma simples'
        // Adicione aqui outras strings que geram escolhas dinâmicas
    ];

    // 2. MODIFICAMOS O LOOP PARA FILTRAR ESSAS STRINGS
    Object.values(this.equipmentChoices).forEach(choice => {
        if (choice && !choiceTriggerStrings.some(trigger => choice.toLowerCase().includes(trigger))) {
            finalEquipmentList.push(choice);
        }
    });

    // O resto do método continua igual...
    // Coleta os itens fixos iniciais, os adicionais da escolha e os do antecedente
    finalEquipmentList.push(...this.fixedEquipment);
    finalEquipmentList.push(...this.additionalFixedItems);
    if (finalCharacter.background?.equipment) {
        finalEquipmentList.push(...finalCharacter.background.equipment);
    }

    // Agora, processamos a lista final para identificar detalhes das armas
    const allWeapons = this.characterService.getAllWeapons();
    const processedEquipment: EquipmentItem[] = [];
    const numberWords: { [key: string]: number } = { 'uma': 1, 'um': 1, 'duas': 2, 'dois': 2, 'cinco': 5, 'dez': 10, 'vinte': 20 };

    finalEquipmentList.forEach(itemString => {
        itemString.split(/, | e /).forEach(part => {
            part = part.trim();
            if (!part) return;

            let itemProcessed = false;
            // Tenta encontrar uma arma e extrair quantidade
            for (const weapon of allWeapons) {
                const weaponPlural = weapon.name.endsWith('s') ? weapon.name : weapon.name + 's';
                const regex = new RegExp(`(\\d+|${Object.keys(numberWords).join('|')})?\\s*(${weapon.name}|${weaponPlural})`, 'i');
                const match = part.match(regex);

                if (match) {
                    let quantity = 1;
                    const quantityMatch = match[1];
                    if (quantityMatch) {
                        quantity = numberWords[quantityMatch.toLowerCase()] || parseInt(quantityMatch, 10);
                    }
                    processedEquipment.push({ name: weapon.name, quantity: quantity, details: weapon });
                    itemProcessed = true;
                    break;
                }
            }

            // Se não é uma arma, adiciona como item genérico
            if (!itemProcessed) {
                processedEquipment.push({ name: part, quantity: 1 });
            }
        });
    });

    finalCharacter.equipment = processedEquipment;

    // Lógica de idiomas
    const finalLanguages = new Set<string>([...this.knownLanguages, ...this.chosenLanguages]);
    finalCharacter.languages = Array.from(finalLanguages);

    const allKnownSpells = [...this.innateSpells, ...this.chosenSpells];
    const uniqueSpells = Array.from(new Map(allKnownSpells.map(s => [s.name, s])).values());
    
    finalCharacter.spells = uniqueSpells
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));
    
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
