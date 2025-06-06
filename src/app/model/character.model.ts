export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Race {
  name: string;
  description: string;
  abilityScoreIncrease?: Partial<AbilityScores>; // Ex: { strength: 2, constitution: 1 }
  ageDescription?: string;
  alignmentDescription?: string;
  size?: string;
  speed?: number;
  traits?: string[]; // Lista de nomes de características
  languages?: string[];
  subraces?: SubRace[];
  sourceBook?: string; // Ex: "Livro do Jogador", "Guia de Volo"
}

export interface SubRace extends Omit<Race, 'subraces'> {
  // Herda de Race, mas não pode ter subraces aninhadas
}

export interface Class {
  name: string;
  description: string;
  hitDie: number; // Ex: 10 para d10
  primaryAbility: string[];
  savingThrowProficiencies: string[];
  armorAndWeaponProficiencies: string[];
  startingEquipmentOptions: string[]; // Descrições das opções
  sourceBook?: string;
  // Adicionar mais características de classe conforme necessário
}

export interface Background {
  name: string;
  description: string;
  skillProficiencies: string[];
  toolProficiencies?: string[];
  languages?: string[];
  equipment: string[];
  feature: { name: string; description: string };
  suggestedCharacteristics?: any; // Detalhar mais tarde
  sourceBook: string;
}

export interface Character {
  name: string;
  race?: Race;
  subrace?: SubRace;
  class?: Class;
  level: number;
  abilityScores: AbilityScores;
  background?: Background;
  alignment?: string;
  skills: { [skillName: string]: boolean }; // Proficiências em perícias
  equipment: string[];
  // Adicionar outros campos como HP, AC, etc.
}