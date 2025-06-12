import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbilityScores } from '../../model/character.model';
import { CharacterCreationService } from '../../service/character-creation.service';

@Component({
  selector: 'app-ability-scores',
  templateUrl: './ability-scores.component.html',
})
export class AbilityScoresComponent implements OnInit {
  @Output() scoresChange = new EventEmitter<AbilityScores>();
  @Output() validityChange = new EventEmitter<boolean>();

  abilityScoreMethod: 'roll' | 'standard' | 'pointbuy' = 'standard';
  assignedScores: AbilityScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
  
  rolledScores: number[] = [];
  abilityScorePool: number[] = [];
  pointBuyPoints = 27;

  abilityKeys: (keyof AbilityScores)[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  abilityMethodOptions = [
    { label: 'Valores Padrão', value: 'standard' },
    { label: 'Rolar Dados', value: 'roll' },
    { label: 'Compra por Pontos', value: 'pointbuy' }
  ];

  constructor(private characterService: CharacterCreationService) {}

  ngOnInit() {
    this.initializeAbilityScores();
  }

  initializeAbilityScores() {
    this.assignedScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    this.abilityScorePool = [];
    this.rolledScores = [];

    if (this.abilityScoreMethod === 'pointbuy') {
      this.assignedScores = { strength: 8, dexterity: 8, constitution: 8, intelligence: 8, wisdom: 8, charisma: 8 };
      this.recalculatePointBuyPoints();
    } else if (this.abilityScoreMethod === 'standard') {
      this.abilityScorePool = [...this.characterService.getStandardArray()];
    }
    this.emitChanges();
  }

  emitChanges() {
    this.scoresChange.emit(this.assignedScores);
    this.validityChange.emit(this.isStepValid());
  }

  isStepValid(): boolean {
    if (this.abilityScoreMethod === 'pointbuy') {
      return this.pointBuyPoints === 0;
    } else {
      const assignedCount = this.abilityKeys.filter(key => this.assignedScores[key] > 0).length;
      return assignedCount === 6;
    }
  }

  onRollScores() {
    this.rolledScores = this.characterService.rollAbilityScores();
    this.resetScoreAssignments();
  }

  resetScoreAssignments() {
    this.assignedScores = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    if (this.abilityScoreMethod === 'standard') {
      this.abilityScorePool = [...this.characterService.getStandardArray()];
    } else if (this.abilityScoreMethod === 'roll' && this.rolledScores.length > 0) {
      this.abilityScorePool = [...this.rolledScores];
    }
    this.emitChanges();
  }

  recalculatePointBuyPoints() {
    let totalCost = 0;
    for (const abilityKey of this.abilityKeys) {
      totalCost += this.characterService.calculatePointBuyCost(this.assignedScores[abilityKey]);
    }
    this.pointBuyPoints = 27 - totalCost;
    this.emitChanges();
  }
  
  onScoreAssigned() {
    this.emitChanges();
  }

  getAvailableScoresFor(currentAbility: keyof AbilityScores): number[] {
    const currentlyAssignedScore = this.assignedScores[currentAbility];
    const otherAssignedScores = this.abilityKeys
      .filter(key => key !== currentAbility)
      .map(key => this.assignedScores[key])
      .filter(score => score > 0);
  
    const tempPool = [...this.abilityScorePool];
    for (const score of otherAssignedScores) {
      const indexToRemove = tempPool.indexOf(score);
      if (indexToRemove !== -1) {
        tempPool.splice(indexToRemove, 1);
      }
    }
  
    const available = [...new Set(tempPool)];
    if (currentlyAssignedScore > 0 && !available.includes(currentlyAssignedScore)) {
      available.push(currentlyAssignedScore);
    }
    return available.sort((a, b) => b - a);
  }
}