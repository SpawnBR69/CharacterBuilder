import { Spell } from './spell.model';

export interface Trait {
  name: string;
  description: string;
  skillProficiencies?: string[];
  spells?: {
    known: string[]; // Magias conhecidas automaticamente
  };
  acCalculation?: {
    base: number; // Ex: 10 para Bárbaro/Monge, 13 para Feiticeiro Dracônico
    attributes: (keyof AbilityScores)[]; // Ex: ['dexterity', 'constitution']
  };
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
  abilityScoreChoice?: {
    count: number;
    amount: number;
    options: (keyof AbilityScores)[] | 'ALL';
  };
  speed?: number;
  traits?: Trait[]; // <- Alterado de string[] para Trait[]
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
  startingEquipment: (string | EquipmentChoiceOption[])[];
  features?: Trait[];
  skillChoices?: {
    count: number;
    options: string[];
  };
  spellcasting?: {
    ability: keyof AbilityScores;
    cantrips_known: number;
    spells_known: number;
  };
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

export type EquipmentChoiceOption = string | {
  type: 'weapon';
  category: 'simple_melee' | 'simple_ranged' | 'simple' | 'martial_melee' | 'martial_ranged' | 'martial';
};

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
  languages: string[];
  spells: Spell[];
}
