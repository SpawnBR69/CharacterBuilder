export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Skill {
  name: string;
  ability: keyof AbilityScores;
  proficient: boolean;
}

export interface Race {
  name: string;
  description: string;
  abilityScoreIncrease?: Partial<AbilityScores>; 
  ageDescription?: string;
  alignmentDescription?: string;
  size?: string;
  speed?: number;
  traits?: string[]; 
  languages?: string[];
  subraces?: SubRace[];
  sourceBook?: string; 
}

export interface SubRace extends Omit<Race, 'subraces' | 'sourceBook'> {
}

export interface Class {
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: string[];
  savingThrowProficiencies: (keyof AbilityScores)[];
  armorAndWeaponProficiencies: string[];
  // ESTRUTURA ATUALIZADA:
  // Agora pode ser um item fixo (string) ou uma escolha entre itens (string[]).
  startingEquipment: (string | string[])[]; 
  sourceBook: string;
}

export interface Background {
  name: string;
  description: string;
  skillProficiencies: string[];
  toolProficiencies?: string[];
  languages?: string[];
  equipment: string[];
  feature: { name: string; description: string };
  suggestedCharacteristics?: any;
  sourceBook: string;
}

export interface Character {
  name: string;
  level: number;
  race?: Race;
  subrace?: SubRace;
  class?: Class;
  background?: Background;
  alignment?: string;
  
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  savingThrows: { [key in keyof AbilityScores]: { proficient: boolean; value: number } };
  skills: { [key: string]: Skill };
  
  armorClass: number;
  initiative: number;
  hitPoints: { max: number; current: number; temporary: number };

  equipment: string[];
  traits: string[];
}