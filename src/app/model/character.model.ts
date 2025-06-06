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
  savingThrowProficiencies: (keyof AbilityScores)[]; // Tipagem forte
  armorAndWeaponProficiencies: string[];
  startingEquipmentOptions: string[];
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
  alignment?: string; // Adicionar seleção de alinhamento em um passo futuro
  
  // Atributos Calculados e Detalhes
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  savingThrows: { [key in keyof AbilityScores]: { proficient: boolean; value: number } };
  skills: { [key: string]: Skill };
  
  // Combate
  armorClass: number;
  initiative: number;
  hitPoints: { max: number; current: number; temporary: number };

  // Outros
  equipment: string[];
  traits: string[]; // Combinação de traços raciais, de classe, etc.
}