import { APP_INITIALIZER , NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CharacterCreationService } from './service/character-creation.service';

// Importações dos Módulos PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { RadioButtonModule } from 'primeng/radiobutton';

import { CharacterNameComponent } from './components/character-name/character-name.component';
import { RaceSelectionComponent } from './components/race-selection/race-selection.component';
import { ClassSelectionComponent } from './components/class-selection/class-selection.component';
import { AbilityScoresComponent } from './components/ability-scores/ability-scores.component';
import { BackgroundSelectionComponent } from './components/background-selection/background-selection.component';
import { EquipmentSelectionComponent } from './components/equipment-selection/equipment-selection.component';
import { CharacterSummaryComponent } from './components/character-summary/character-summary.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';
import { TooltipModule } from 'primeng/tooltip';
import { Observable } from 'rxjs';
import { SpellService } from './service/spell.service';
import { SpellSelectionComponent } from './components/spell-selection/spell-selection.component';
import { MultiSelectModule } from 'primeng/multiselect';

function initializeSpells(spellService: SpellService): () => Observable<any> {
  return () => spellService.loadSpells();
}

@NgModule({
  declarations: [
    AppComponent,
    CharacterNameComponent,
    RaceSelectionComponent,
    ClassSelectionComponent,
    AbilityScoresComponent,
    BackgroundSelectionComponent,
    EquipmentSelectionComponent,
    CharacterSummaryComponent,
    SpellSelectionComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    SelectButtonModule,
    InputNumberModule,
    RadioButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    MultiSelectModule
  ],
  providers: [
    SpellService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeSpells,
      deps: [SpellService],
      multi: true
    },
    CharacterCreationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }