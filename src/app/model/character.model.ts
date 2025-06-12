export interface Trait {
  name: string;
  description: string;
}

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
  speed?: number;
  traits?: Trait[]; // <- Alterado de string[] para Trait[]
  languages?: string[];
  subraces?: SubRace[];
  sourceBook?: string; 
}

export interface SubRace extends Omit<Race, 'subraces' | 'sourceBook'> {
  // traits já é Trait[] por causa do Omit
}

export interface Class {
  name: string;
  description: string;
  hitDie: number;
  primaryAbility: string[];
  savingThrowProficiencies: (keyof AbilityScores)[];
  armorAndWeaponProficiencies: string[];
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
  feature: Trait; // <- Alterado para usar a interface Trait
  sourceBook: string;
}

export interface Character {
  name: string;
  level: number;
  race?: Race;
  subrace?: SubRace;
  class?: Class;
  background?: Background;
  
  abilityScores: AbilityScores;
  proficiencyBonus: number;
  savingThrows: { [key in keyof AbilityScores]: { proficient: boolean; value: number } };
  skills: { [key: string]: Skill };
  
  armorClass: number;
  initiative: number;
  hitPoints: { max: number; current: number; temporary: number };

  equipment: string[];
  traits: Trait[]; // <- Alterado de string[] para Trait[]
}
