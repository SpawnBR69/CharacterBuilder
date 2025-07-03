import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbilityScores, Character, Skill } from '../../model/character.model';
import { Spell } from '../../model/spell.model';

@Component({
  selector: 'app-character-summary',
  templateUrl: './character-summary.component.html',
})
export class CharacterSummaryComponent {
  @Input() character: Partial<Character> = {};
  @Output() download = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();

  get abilityKeys(): (keyof AbilityScores)[] {
    return ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  }

  getAbilityModifier(score: number | undefined): number {
    if (score === undefined) return 0;
    return Math.floor((score - 10) / 2);
  }

  getModifierString(value: number | undefined): string {
    if (value === undefined) return '+0';
    return value >= 0 ? `+${value}` : `${value}`;
  }

  getSkillModifierValue(skill: Skill): number {
    if (!this.character.abilityScores || !this.character.proficiencyBonus) return 0;
    const modifier = this.getAbilityModifier(this.character.abilityScores[skill.ability]);
    const proficiencyBonus = skill.proficient ? this.character.proficiencyBonus : 0;
    return modifier + proficiencyBonus;
  }

  get spellsByLevel(): { level: number, spells: Spell[] }[] {
    if (!this.character.spells?.length) return [];

    const grouped = this.character.spells.reduce((acc, spell) => {
      (acc[spell.level] = acc[spell.level] || []).push(spell);
      return acc;
    }, {} as { [level: number]: Spell[] });

    return Object.keys(grouped).map(level => ({
      level: +level,
      spells: grouped[+level]
    }));
  }
}