import { Injectable } from '@angular/core';
import { AbilityScores } from '../model/character.model';

// O @Injectable com 'root' torna o serviço disponível em toda a aplicação.
@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  // A lógica que antes estava no componente agora vive aqui.
  private abilityTranslations: { [key in keyof AbilityScores]: { name:string, abbr:string } } = {
    strength:     { name: 'Força',         abbr: 'FOR' },
    dexterity:    { name: 'Destreza',      abbr: 'DES' },
    constitution: { name: 'Constituição',  abbr: 'CON' },
    intelligence: { name: 'Inteligência',  abbr: 'INT' },
    wisdom:       { name: 'Sabedoria',     abbr: 'SAB' },
    charisma:     { name: 'Carisma',       abbr: 'CAR' },
  };

  private skillToAbilityMap: { [skillName: string]: keyof AbilityScores } = {
    'Acrobacia': 'dexterity', 'Adestrar Animais': 'wisdom',
    'Arcanismo': 'intelligence', 'Atletismo': 'strength',
    'Enganação': 'charisma', 'Furtividade': 'dexterity',
    'História': 'intelligence', 'Intimidação': 'charisma',
    'Intuição': 'wisdom', 'Investigação': 'intelligence',
    'Medicina': 'wisdom', 'Natureza': 'intelligence',
    'Percepção': 'wisdom', 'Atuação': 'charisma',
    'Persuasão': 'charisma', 'Prestidigitação': 'dexterity',
    'Religião': 'intelligence', 'Sobrevivência': 'wisdom'
  };

  constructor() { }

  // O método público que os componentes irão chamar.
  getAbilityTranslation(ability: keyof AbilityScores): { name: string, abbr: string } {
    // Retorna um objeto vazio como fallback para evitar erros, caso a chave não exista.
    return this.abilityTranslations[ability] || { name: '', abbr: '' };
  }

  getAbilityForSkill(skillName: string): keyof AbilityScores | undefined {
    return this.skillToAbilityMap[skillName];
  }
}