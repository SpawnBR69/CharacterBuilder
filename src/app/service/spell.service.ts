import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Spell } from '../model/spell.model';

@Injectable({
  providedIn: 'root'
})
export class SpellService {

  private spells: Spell[] = [];
  private dataLoaded = false;

  constructor(private http: HttpClient) { }

  /**
   * Carrega a lista de magias do arquivo JSON.
   * O tap armazena os dados localmente (cache) para evitar múltiplas chamadas.
   */
  loadSpells(): Observable<Spell[]> {
    return this.http.get<Spell[]>('assets/data/phb_spells.json').pipe(
      tap(data => {
        this.spells = data;
        this.dataLoaded = true;
      })
    );
  }

  /**
   * Retorna a lista completa de magias pré-carregadas.
   */
  getAllSpells(): Spell[] {
    if (!this.dataLoaded) {
      console.error("Dados de magias não foram carregados ainda!");
      return [];
    }
    return this.spells;
  }

  /**
   * Retorna as magias disponíveis para uma classe específica.
   * @param className - O nome da classe (ex: "Mago").
   */
  getSpellsByClass(className: string): Spell[] {
    return this.getAllSpells().filter(spell => spell.classes.includes(className));
  }
}