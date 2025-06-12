import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Race, Class, Background } from '../model/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterCreationService {
  private races: Race[] = [];
  private classes: Class[] = [];
  private backgrounds: Background[] = [];

  constructor(private http: HttpClient) {}

  // Carrega todos os dados dos arquivos JSON
  loadAllData(): Observable<void> {
    const bookSources = {
      races: ['phb_races.json', 'vgm_races.json'],
      classes: ['phb_classes.json'],
      backgrounds: ['phb_backgrounds.json'],
    };

    const raceRequests = bookSources.races.map(file => this.http.get<Race[]>(`assets/data/${file}`));
    const classRequests = bookSources.classes.map(file => this.http.get<Class[]>(`assets/data/${file}`));
    const backgroundRequests = bookSources.backgrounds.map(file => this.http.get<Background[]>(`assets/data/${file}`));

    return forkJoin({
      races: forkJoin(raceRequests),
      classes: forkJoin(classRequests),
      backgrounds: forkJoin(backgroundRequests),
    }).pipe(
      tap(results => {
        // Concatena os arrays de diferentes livros
        this.races = results.races.flat();
        this.classes = results.classes.flat();
        this.backgrounds = results.backgrounds.flat();
        
        // Ordena alfabeticamente para melhor apresentação
        this.races.sort((a, b) => a.name.localeCompare(b.name));
        this.classes.sort((a, b) => a.name.localeCompare(b.name));
        this.backgrounds.sort((a, b) => a.name.localeCompare(b.name));
      }),
      map(() => void 0) // Transforma o resultado para void
    );
  }

  // Métodos GET agora simplesmente retornam os dados pré-carregados
  getRaces = (): Race[] => this.races;
  getClasses = (): Class[] => this.classes;
  getBackgrounds = (): Background[] => this.backgrounds;

  // --- LÓGICA DOS VALORES DE HABILIDADE (permanece a mesma) ---
  rollAbilityScores(): number[] {
    const scores: number[] = [];
    for (let i = 0; i < 6; i++) {
      const rolls: number[] = [];
      for (let j = 0; j < 4; j++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
      }
      rolls.sort((a, b) => b - a);
      const sum = rolls.slice(0, 3).reduce((acc, val) => acc + val, 0);
      scores.push(sum);
    }
    return scores;
  }

  getStandardArray = (): number[] => [15, 14, 13, 12, 10, 8];

  calculatePointBuyCost(score: number): number {
    if (score < 8) return 0;
    if (score > 15) return 999;
    if (score <= 13) return score - 8;
    if (score === 14) return 7;
    if (score === 15) return 9;
    return 0;
  }
}