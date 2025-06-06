import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';

import { AppComponent } from './app.component';
import { CharacterCreationService } from './service/character-creation.service'; // Importe o serviço

@NgModule({
  declarations: [
    AppComponent
    // Adicionar outros componentes aqui se fossem separados
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
  ],
  providers: [
    CharacterCreationService // Adicione o serviço aos providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }