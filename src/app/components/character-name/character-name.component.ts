import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-character-name',
  templateUrl: './character-name.component.html',
})
export class CharacterNameComponent {
  @Input() characterName: string | undefined = '';
  @Output() nameChange = new EventEmitter<string>();
  @Output() fileSelected = new EventEmitter<Event>();

  onNameChange(event: Event) {
    const name = (event.target as HTMLInputElement).value;
    this.nameChange.emit(name);
  }
}
