import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Necessário para ngModel

import { AppComponent } from './app.component';
import { CharacterCreationService } from './service/character-creation.service'; // Importe o serviço

@NgModule({
  declarations: [
    AppComponent
    // Adicionar outros componentes aqui se fossem separados
  ],
  imports: [
    BrowserModule,
    FormsModule // Adicione FormsModule aos imports
  ],
  providers: [
    CharacterCreationService // Adicione o serviço aos providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }