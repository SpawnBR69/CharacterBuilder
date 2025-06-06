import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Race, Class, Background, AbilityScores, Character } from '../model/character.model';

@Injectable({
  providedIn: 'root',
})
export class CharacterCreationService {
  private characterSource = new BehaviorSubject<Partial<Character>>({
    level: 1,
    abilityScores: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
    skills: {},
    equipment: [],
  });
  currentCharacter = this.characterSource.asObservable();

  constructor() {}

  updateCharacter(data: Partial<Character>) {
    const currentChar = this.characterSource.getValue();
    this.characterSource.next({ ...currentChar, ...data });
  }

  // --- DADOS DO JOGADOR (Exemplos simplificados - preencher com dados do Livro do Jogador) ---

  getRaces(): Race[] {
    // Dados baseados no Livro do Jogador (PHB) e Guia de Volo para Monstros (VGM)
    return [
      // Raças do Livro do Jogador
      {
        name: 'Anão',
        description: 'Corajosos e resistentess, os anões são conhecidos como hábeis guerreiros, mineradores e trabalhadores em pedra e metal.',
        abilityScoreIncrease: { constitution: 2 },
        ageDescription: 'Anões maturam no mesmo ritmo que os humanos, mas são considerados jovens até atingirem os 50 anos. Em média, vivem 350 anos.',
        alignmentDescription: 'A maioria dos anões é leal, acreditando firmemente nos benefícios de uma sociedade bem organizada. Eles tendem para o bem, com um forte senso de justiça.',
        size: 'Médio',
        speed: 7.5, // 25 feet
        languages: ['Comum', 'Anão'],
        traits: ['Visão no Escuro', 'Resiliência Anã', 'Treinamento de Combate Anão', 'Proficiência com Ferramentas (à escolha: ferramentas de ferreiro, cervejeiro ou pedreiro)', 'Especialização em Rochas'],
        sourceBook: 'Livro do Jogador',
        subraces: [
          { name: 'Anão da Colina', description: 'Como um anão da colina, você tem sentidos aguçados, profunda intuição e notável resiliência.', abilityScoreIncrease: { wisdom: 1 }, traits: ['Tenacidade Anã'] },
          { name: 'Anão da Montanha', description: 'Como um anão da montanha, você é forte e resistente, acostumado à vida difícil em terreno acidentado.', abilityScoreIncrease: { strength: 2 }, traits: ['Treinamento Anão com Armaduras'] }
        ]
      },
      {
        name: 'Elfo',
        description: 'Elfos são um povo mágico de graça sobrenatural, vivendo no mundo mas não inteiramente parte dele.',
        abilityScoreIncrease: { dexterity: 2 },
        ageDescription: 'Embora os elfos atinjam a maturidade física aproximadamente na mesma idade que os humanos, a compreensão élfica da idade adulta vai além do crescimento físico para abranger a experiência mundana. Um elfo tipicamente assume a idade adulta e um nome adulto por volta dos 100 anos de idade e pode viver até 750 anos.',
        alignmentDescription: 'Elfos amam a liberdade, a variedade e a autoexpressão, então eles se inclinam fortemente para os aspectos mais gentis do caos. Eles valorizam e protegem a liberdade dos outros tanto quanto a sua própria. Elfos são mais frequentemente bons do que não.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Élfico'],
        traits: ['Visão no Escuro', 'Sentidos Aguçados (Proficiência em Percepção)', 'Ancestralidade Feérica', 'Transe'],
        sourceBook: 'Livro do Jogador',
        subraces: [
          { name: 'Alto Elfo', description: 'Como um alto elfo, você tem uma mente perspicaz e um domínio da magia básica, ou pelo menos da teoria mágica.', abilityScoreIncrease: { intelligence: 1 }, traits: ['Treinamento Élfico com Armas', 'Truque (de Mago)', 'Idioma Adicional'] },
          { name: 'Elfo da Floresta', description: 'Como um elfo da floresta, você tem sentidos aguçados e intuição, e seus pés ágeis o conduzem rápida e furtivamente através de suas florestas nativas.', abilityScoreIncrease: { wisdom: 1 }, traits: ['Treinamento Élfico com Armas', 'Pés Ligeiros', 'Máscara da Natureza'] },
          { name: 'Drow (Elfo Negro)', description: 'Descendentes de uma linhagem mais sombria de elfos, os drow são adaptados à vida no Subterrâneo.', abilityScoreIncrease: { charisma: 1 }, traits: ['Visão no Escuro Superior', 'Sensibilidade à Luz Solar', 'Magia Drow', 'Treinamento Drow com Armas'] }
        ]
      },
      {
        name: 'Halfling',
        description: 'Os halflings são um povo amável e alegre. Eles apreciam os confortos do lar e preferem os prazeres simples da vida.',
        abilityScoreIncrease: { dexterity: 2 },
        ageDescription: 'Um halfling atinge a idade adulta aos 20 anos e geralmente vive até a metade de seu segundo século.',
        alignmentDescription: 'A maioria dos halflings é leal e boa. Como regra, eles são bondosos e não suportam ver os outros sofrerem. São leais aos seus amigos, família e comunidades.',
        size: 'Pequeno',
        speed: 7.5, // 25 feet
        languages: ['Comum', 'Halfling'],
        traits: ['Sortudo', 'Corajoso', 'Agilidade Halfling'],
        sourceBook: 'Livro do Jogador',
        subraces: [
          { name: 'Pés Leves', description: 'Os Pés Leves são mais propensos à vontade de viajar do que outros halflings, e muitas vezes vivem entre outros povos ou levam uma vida nômade.', abilityScoreIncrease: { charisma: 1 }, traits: ['Furtividade Natural'] },
          { name: 'Robusto', description: 'Os Robustos são mais resistentes que outros halflings e têm alguma resistência a venenos.', abilityScoreIncrease: { constitution: 1 }, traits: ['Resiliência Robusta'] }
        ]
      },
      {
        name: 'Humano',
        description: 'Humanos são os mais adaptáveis e ambiciosos entre as raças comuns. Seja qual for a sua origem, os humanos são inovadores, realizadores e pioneiros.',
        abilityScoreIncrease: { strength: 1, dexterity: 1, constitution: 1, intelligence: 1, wisdom: 1, charisma: 1 },
        ageDescription: 'Humanos atingem a idade adulta no final da adolescência e raramente vivem um século inteiro.',
        alignmentDescription: 'Humanos não tendem a nenhum alinhamento em particular. O melhor e o pior são encontrados entre eles.',
        size: 'Médio', // Varia de 1,5m a pouco mais de 1,8m de altura.
        speed: 9, // 30 feet
        languages: ['Comum', 'Um idioma adicional à escolha'],
        traits: [], // Variantes podem adicionar traços. A versão base tem apenas os aumentos de habilidade.
        sourceBook: 'Livro do Jogador',
        // A variante Humano é frequentemente usada:
        // { name: 'Humano Variante', description: '...', abilityScoreIncrease: { /* Dois scores +1 */ }, traits: ['Perícia Adicional', 'Talento Adicional'] }
      },
      {
        name: 'Draconato',
        description: 'Nascidos de dragões, como o nome proclama, os draconatos caminham orgulhosamente por um mundo que os saúda com medo e incompreensão.',
        abilityScoreIncrease: { strength: 2, charisma: 1 },
        ageDescription: 'Draconatos jovens crescem rapidamente. Eles andam horas após a eclosão, atingem o tamanho e desenvolvimento de uma criança humana de 10 anos aos 3 anos, e atingem a idade adulta aos 15. Vivem cerca de 80 anos.',
        alignmentDescription: 'Draconatos tendem a extremos, fazendo uma escolha consciente por um lado ou outro na guerra cósmica entre o bem e o mal. A maioria dos draconatos é boa, mas aqueles que se voltam para o mal podem ser terrivelmente malignos.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Dracônico'],
        traits: ['Ancestralidade Dracônica (escolher tipo de dragão)', 'Sopro de Arma', 'Resistência a Dano (conforme ancestralidade)'],
        sourceBook: 'Livro do Jogador',
      },
      {
        name: 'Gnomo',
        description: 'Um gnomo é bem-vindo em toda parte como um técnico, alquimista ou inventor. Apesar da demanda por suas habilidades, a maioria dos gnomos prefere ficar entre os seus.',
        abilityScoreIncrease: { intelligence: 2 },
        ageDescription: 'Gnomos maturam na mesma proporção que humanos, e a maioria firma-se numa vida adulta por volta dos 40 anos. Podem viver de 350 a quase 500 anos.',
        alignmentDescription: 'Gnomos são na maioria das vezes bons. Aqueles que tendem para a lei são sábios, engenheiros, pesquisadores, escolásticos, investigadores ou inventores. Aqueles que tendem para o caos são menestréis, embusteiros, andarilhos ou joalheiros caprichosos.',
        size: 'Pequeno',
        speed: 7.5, // 25 feet
        languages: ['Comum', 'Gnômico'],
        traits: ['Esperteza Gnômica', 'Visão no Escuro'],
        sourceBook: 'Livro do Jogador',
        subraces: [
          { name: 'Gnomo da Floresta', description: 'Estes gnomos têm um talento natural para furtividade e ilusão.', abilityScoreIncrease: { dexterity: 1 }, traits: ['Ilusionista Nato', 'Falar com Bestas Pequenas'] },
          { name: 'Gnomo das Rochas', description: 'Estes gnomos são conhecidos como inventores e engenhoqueiros habilidosos.', abilityScoreIncrease: { constitution: 1 }, traits: ['Conhecimento de Artífice', 'Engenhoqueiro'] }
        ]
      },
      {
        name: 'Meio-Elfo',
        description: 'Caminhando entre dois mundos, mas não pertencendo verdadeiramente a nenhum, os meio-elfos combinam o que alguns dizem ser as melhores qualidades de seus pais humanos e elfos.',
        abilityScoreIncrease: { charisma: 2 /* , e dois outros scores +1 */ },
        ageDescription: 'Meio-elfos maturam na mesma proporção que humanos, atingindo a idade adulta por volta dos 20 anos. Eles vivem muito mais que humanos, no entanto, frequentemente excedendo 180 anos.',
        alignmentDescription: 'Meio-elfos compartilham a inclinação caótica de sua herança élfica. Eles valorizam tanto a liberdade pessoal quanto a expressão criativa, não demonstrando amor por líderes, nem desejo por seguidores.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Élfico', 'Um idioma adicional à escolha'],
        traits: ['Visão no Escuro', 'Ancestralidade Feérica', 'Versatilidade em Perícia (proficiência em duas perícias à escolha)'],
        sourceBook: 'Livro do Jogador',
      },
      {
        name: 'Meio-Orc',
        description: 'Quer estejam unidos em tribos ou lutando para encontrar seu caminho em cidades “civilizadas”, os meio-orcs são conhecidos por sua força e selvageria.',
        abilityScoreIncrease: { strength: 2, constitution: 1 },
        ageDescription: 'Meio-orcs maturam um pouco mais rápido que humanos, atingindo a idade adulta por volta dos 14 anos. Eles também envelhecem notavelmente mais rápido e raramente vivem mais de 75 anos.',
        alignmentDescription: 'Meio-orcs herdam uma tendência ao caos de seus pais orcs e não são fortemente inclinados ao bem. Meio-orcs que crescem entre orcs e voluntariamente vivem com eles são usualmente malignos.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Orc'],
        traits: ['Visão no Escuro', 'Ameaçador (proficiência em Intimidação)', 'Resistência Implacável', 'Ataques Selvagens'],
        sourceBook: 'Livro do Jogador',
      },
      {
        name: 'Tiefling',
        description: 'Ser saudado com olhares e cochichos, sofrer violência e insultos na rua, ver desconfiança e medo nos olhos de todos; este é o fardo do tiefling.',
        abilityScoreIncrease: { intelligence: 1, charisma: 2 },
        ageDescription: 'Tieflings maturam na mesma proporção que humanos, mas vivem alguns anos a mais.',
        alignmentDescription: 'Tieflings podem não ter uma tendência inata ao mal, mas muitos deles acabam lá. Maus ou não, uma natureza independente inclina muitos tieflings ao alinhamento caótico.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Infernal'],
        traits: ['Visão no Escuro', 'Resistência Infernal (resistência a dano de fogo)', 'Legado Infernal (Taumaturgia, Repreensão Infernal, Escuridão)'],
        sourceBook: 'Livro do Jogador',
      },

      // Raças do Guia de Volo para Monstros
      {
        name: 'Aasimar',
        description: 'Os Aasimar carregam em suas almas a luz dos céus. Eles descendem de humanos com um toque do poder celestial do Monte Celestia.',
        abilityScoreIncrease: { charisma: 2 },
        ageDescription: 'Aasimar maturam na mesma proporção que humanos, mas podem viver até 160 anos.',
        alignmentDescription: 'Imbuídos com poder celestial, os aasimar são frequentemente bons. No entanto, alguns aasimar caem em desgraça, abraçando o mal.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Celestial'],
        traits: ['Visão no Escuro', 'Resistência Celestial (resistência a dano necrótico e radiante)', 'Mãos Curativas', 'Portador da Luz'],
        sourceBook: 'Guia de Volo para Monstros',
        subraces: [
          { name: 'Aasimar Protetor', description: 'Aasimar protetores são encarregados por poderes do bem para guardar os fracos e golpear as forças do mal.', abilityScoreIncrease: { wisdom: 1 }, traits: ['Alma Radiante'] },
          { name: 'Aasimar Flagelo', description: 'Aasimar flagelos são imbuídos com um desejo divino de destruir o mal - um desejo que é, na melhor das hipóteses, uma bênção e, na pior, uma maldição.', abilityScoreIncrease: { constitution: 1 }, traits: ['Consumo Radiante'] },
          { name: 'Aasimar Caído', description: 'Um aasimar que foi tocado por poderes sombrios quando jovem ou que se voltou para o mal mais tarde na vida pode se tornar um dos caídos.', abilityScoreIncrease: { strength: 1 }, traits: ['Sudário Necrótico'] }
        ]
      },
      {
        name: 'Firbolg',
        description: 'Os Firbolgs são reclusos habitantes da floresta que preferem a paz e a tranquilidade de seus lares à intrusão do mundo exterior.',
        abilityScoreIncrease: { wisdom: 2, strength: 1 },
        ageDescription: 'Como fey, os firbolgs têm longas vidas. Um firbolg atinge a idade adulta por volta dos 30 anos e o mais velho entre eles pode viver 500 anos.',
        alignmentDescription: 'Firbolgs amam a natureza e se esforçam para manter seu equilíbrio. A maioria é neutra boa.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Élfico', 'Gigante'],
        traits: ['Magia Firbolg', 'Passo Escondido', 'Fala Poderosa', 'Fala das Bestas e Folhas'],
        sourceBook: 'Guia de Volo para Monstros',
      },
      {
        name: 'Goliath',
        description: 'Os Goliaths vivem nos picos mais altos das montanhas, onde o ar é rarefeito e os ventos uivam. Eles são um povo orgulhoso e competitivo.',
        abilityScoreIncrease: { strength: 2, constitution: 1 },
        ageDescription: 'Goliaths têm expectativas de vida comparáveis aos humanos. Eles entram na idade adulta no final da adolescência e geralmente vivem menos de um século.',
        alignmentDescription: 'A sociedade Goliath, com seus papéis e tarefas claras, tem uma forte inclinação leal. O senso de justiça do goliath, equilibrado com uma ênfase na auto-suficiência e responsabilidade pessoal, os empurra para a neutralidade.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Gigante'],
        traits: ['Atleta Natural (proficiência em Atletismo)', 'Resistência da Pedra', 'Nascido na Montanha', 'Construção Poderosa'],
        sourceBook: 'Guia de Volo para Monstros', // Também no Elemental Evil Player's Companion
      },
      {
        name: 'Kenku',
        description: 'Amaldiçoados com uma falta de criatividade e a incapacidade de voar, os Kenku vagam pelo mundo como pedintes e ladrões que vivem à margem da sociedade humana.',
        abilityScoreIncrease: { dexterity: 2, wisdom: 1 },
        ageDescription: 'Kenku têm expectativas de vida mais curtas que os humanos. Eles atingem a maturidade por volta dos 12 anos e podem viver até os 60.',
        alignmentDescription: 'Kenku são tipicamente caóticos neutros, primariamente focados em seus próprios interesses.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum (entendem, mas falam apenas por mimetismo)', 'Auran (entendem, mas falam apenas por mimetismo)'],
        traits: ['Perito em Falsificação', 'Treinamento Kenku (proficiência em duas perícias à escolha: Acrobacia, Enganação, Furtividade, Prestidigitação)', 'Mimetismo'],
        sourceBook: 'Guia de Volo para Monstros',
      },
      {
        name: 'Povo-Lagarto',
        description: 'Os Povo-Lagarto são sobreviventes primitivos que habitam pântanos e charcos. Eles são conhecidos por sua natureza alienígena e, às vezes, brutal.',
        abilityScoreIncrease: { constitution: 2, wisdom: 1 },
        ageDescription: 'Povo-lagarto atingem a maturidade por volta dos 14 anos e raramente vivem mais de 60 anos.',
        alignmentDescription: 'A maioria dos povo-lagarto é neutra. Eles veem o mundo como um lugar de predadores e presas, onde a vida e a morte são processos naturais.',
        size: 'Médio',
        speed: 9, // 30 feet (e velocidade de natação de 9m)
        languages: ['Comum', 'Dracônico'],
        traits: ['Mordida', 'Artesão Astuto', 'Prender a Respiração', 'Defesa Natural', 'Determinação Faminta', 'Armadura Natural'],
        sourceBook: 'Guia de Volo para Monstros',
      },
      {
        name: 'Tabaxi',
        description: 'Originários de uma estranha e distante terra, os tabaxi são humanoides felinos guiados pela curiosidade para colecionar artefatos interessantes, reunir contos e observar todas as maravilhas do mundo.',
        abilityScoreIncrease: { dexterity: 2, charisma: 1 },
        ageDescription: 'Tabaxi têm expectativas de vida equivalentes às dos humanos.',
        alignmentDescription: 'Tabaxi tendem a ser caóticos, com pouca consideração por regras ou leis. Eles são geralmente bons de coração, mas alguns podem ser egoístas e gananciosos.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Um idioma adicional à escolha'],
        traits: ['Visão no Escuro', 'Agilidade Felina', 'Garras de Gato', 'Percepção Felina (proficiência em Percepção e Furtividade)'],
        sourceBook: 'Guia de Volo para Monstros',
      },
      {
        name: 'Tritão',
        description: 'Os Tritões são um povo aquático, guardiões das profundezas oceânicas, que raramente se aventuram em terra firme.',
        abilityScoreIncrease: { strength: 1, constitution: 1, charisma: 1 },
        ageDescription: 'Tritões atingem a maturidade na mesma idade que os humanos e vivem cerca de 200 anos.',
        alignmentDescription: 'Tritões tendem a ser leais e bons. Eles são ensinados desde jovens a proteger os oceanos e aqueles que neles habitam.',
        size: 'Médio',
        speed: 9, // 30 feet (e velocidade de natação de 9m)
        languages: ['Comum', 'Primordial (Aquan)'],
        traits: ['Anfíbio', 'Controle do Ar e da Água', 'Emissário das Profundezas', 'Guardião das Profundezas'],
        sourceBook: 'Guia de Volo para Monstros',
      },
      // Raças Monstruosas do Guia de Volo
      {
        name: 'Bugbear',
        description: 'Bugbears são goblins grandes e peludos que confiam na furtividade e na força para aterrorizar seus inimigos.',
        abilityScoreIncrease: { strength: 2, dexterity: 1 },
        ageDescription: 'Bugbears atingem a idade adulta aos 16 anos e vivem até 80 anos.',
        alignmentDescription: 'Bugbears tendem para o caótico mau, vivendo para satisfazer seus próprios desejos egoístas e violentos.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Goblin'],
        traits: ['Visão no Escuro', 'Braços Longos', 'Corpo Poderoso', 'Ataque Surpresa', 'Furtivo (proficiência em Furtividade)'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      },
      {
        name: 'Goblin',
        description: 'Goblins são pequenos humanoides malévolos e egoístas que vivem em tribos subterrâneas ou em ruínas desoladas.',
        abilityScoreIncrease: { dexterity: 2, constitution: 1 },
        ageDescription: 'Goblins atingem a idade adulta aos 8 anos e vivem até 60 anos.',
        alignmentDescription: 'Goblins são tipicamente neutros malignos, pois se preocupam apenas com suas próprias necessidades e prazeres.',
        size: 'Pequeno',
        speed: 9, // 30 feet
        languages: ['Comum', 'Goblin'],
        traits: ['Visão no Escuro', 'Fúria dos Pequenos', 'Escapada Ágil'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      },
      {
        name: 'Hobgoblin',
        description: 'Hobgoblins são humanoides militaristas e disciplinados, obcecados com a guerra e a conquista.',
        abilityScoreIncrease: { constitution: 2, intelligence: 1 },
        ageDescription: 'Hobgoblins maturam na mesma taxa que os humanos e têm expectativas de vida semelhantes.',
        alignmentDescription: 'A sociedade hobgoblin é construída sobre uma rígida hierarquia militar, tornando-os inerentemente leais. Eles são geralmente malignos, não vendo valor na vida além de seu próprio clã.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Goblin'],
        traits: ['Visão no Escuro', 'Treinamento Marcial', 'Fortuna dos Muitos'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      },
      {
        name: 'Kobold',
        description: 'Kobolds são pequenos humanoides reptilianos que se destacam em cavar túneis e armar armadilhas.',
        abilityScoreIncrease: { dexterity: 2, strength: -2 }, // Força -2 é uma característica comum, mas não um aumento.
        ageDescription: 'Kobolds atingem a idade adulta aos 6 anos e podem viver até 120 anos, mas raramente o fazem.',
        alignmentDescription: 'Kobolds são fundamentalmente leais maus, geralmente subservientes a dragões ou outros poderes malignos.',
        size: 'Pequeno',
        speed: 9, // 30 feet
        languages: ['Comum', 'Dracônico'],
        traits: ['Visão no Escuro', 'Escavar', 'Táticas de Bando', 'Sensibilidade à Luz Solar', 'Servidão Dracônica'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      },
      {
        name: 'Orc',
        description: 'Orcs são humanoides selvagens e brutais conhecidos por sua ferocidade em batalha.',
        abilityScoreIncrease: { strength: 2, constitution: 1, intelligence: -2 }, // Inteligência -2 é comum.
        ageDescription: 'Orcs atingem a idade adulta aos 12 anos e vivem até os 40 anos.',
        alignmentDescription: 'Orcs são geralmente caóticos malignos, vivendo vidas de violência e pilhagem.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Orc'],
        traits: ['Visão no Escuro', 'Agressivo', 'Corpo Poderoso', 'Ameaçador (proficiência em Intimidação)'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      },
      {
        name: 'Yuan-ti Puro-sangue',
        description: 'Yuan-ti puro-sangues são os mais humanos dos yuan-ti, capazes de se infiltrar em sociedades humanoides enquanto servem a seus mestres serpentinos.',
        abilityScoreIncrease: { charisma: 2, intelligence: 1 },
        ageDescription: 'Puro-sangues maturam na mesma taxa que os humanos e têm expectativas de vida semelhantes.',
        alignmentDescription: 'Puro-sangues são tipicamente neutros malignos, desprovidos de emoção e focados em seus próprios objetivos e nos de seus deuses serpentes.',
        size: 'Médio',
        speed: 9, // 30 feet
        languages: ['Comum', 'Abissal', 'Dracônico'],
        traits: ['Visão no Escuro', 'Imunidade a Veneno (Imunidade a dano de veneno e à condição envenenado)', 'Resistência à Magia', 'Magia Inata (Truque de Veneno, Amizade Animal (apenas cobras), Sugestão)'],
        sourceBook: 'Guia de Volo para Monstros (Raça Monstruosa)',
      }
    ];
  }

  getClasses(): Class[] {
    // Todas as classes base do Livro do Jogador com a tipagem correta para savingThrowProficiencies
    return [
      {
        name: 'Bárbaro',
        description: 'Um guerreiro feroz que pode entrar em fúria de batalha.',
        hitDie: 12,
        primaryAbility: ['Força'],
        savingThrowProficiencies: ['strength', 'constitution'],
        armorAndWeaponProficiencies: ['Armaduras leves e médias', 'escudos', 'armas simples e marciais'],
        startingEquipmentOptions: [
          '(a) um machado grande ou (b) qualquer arma marcial corpo a corpo',
          '(a) duas machadinhas ou (b) qualquer arma simples',
          'Um pacote de aventureiro e quatro azagaias'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Bardo',
        description: 'Um mestre da música, fala e magia, que inspira aliados e desmoraliza inimigos.',
        hitDie: 8,
        primaryAbility: ['Carisma'],
        savingThrowProficiencies: ['dexterity', 'charisma'],
        armorAndWeaponProficiencies: ['Armaduras leves', 'armas simples', 'bestas de mão', 'espadas longas', 'rapieiras', 'espadas curtas'],
        startingEquipmentOptions: [
          '(a) uma rapieira, (b) uma espada longa ou (c) qualquer arma simples',
          '(a) um pacote de diplomata ou (b) um pacote de artista',
          '(a) um alaúde ou (b) qualquer outro instrumento musical',
          'Corselete de couro e uma adaga'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Bruxo',
        description: 'Um manipulador de magia derivada de um pacto com uma entidade extraplanar.',
        hitDie: 8,
        primaryAbility: ['Carisma'],
        savingThrowProficiencies: ['wisdom', 'charisma'],
        armorAndWeaponProficiencies: ['Armaduras leves', 'armas simples'],
        startingEquipmentOptions: [
          '(a) uma besta leve e 20 virotes ou (b) qualquer arma simples',
          '(a) uma bolsa de componentes ou (b) um foco arcano',
          '(a) um pacote de estudioso ou (b) um pacote de masmorra',
          'Corselete de couro, qualquer arma simples e duas adagas'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Clérigo',
        description: 'Um campeão sacerdotal que empunha magia divina a serviço de um poder maior.',
        hitDie: 8,
        primaryAbility: ['Sabedoria'],
        savingThrowProficiencies: ['wisdom', 'charisma'],
        armorAndWeaponProficiencies: ['Armaduras leves e médias', 'escudos', 'todas as armas simples'],
        startingEquipmentOptions: [
          '(a) uma maça ou (b) um martelo de guerra (se proficiente)',
          '(a) brunea, (b) corselete de couro ou (c) cota de malha (se proficiente)',
          '(a) uma besta leve e 20 virotes ou (b) qualquer arma simples',
          '(a) um pacote de sacerdote ou (b) um pacote de aventureiro',
          'Um escudo e um símbolo sagrado'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Druida',
        description: 'Um sacerdote da Velha Fé, que empunha os poderes da natureza e adota formas de animais.',
        hitDie: 8,
        primaryAbility: ['Sabedoria'],
        savingThrowProficiencies: ['intelligence', 'wisdom'],
        armorAndWeaponProficiencies: ['Armaduras leves e médias (não-metálicas)', 'escudos (não-metálicos)', 'clavas', 'adagas', 'dardos', 'azagaias', 'maças', 'bordões', 'cimitarras', 'fundas', 'lanças'],
        startingEquipmentOptions: [
          '(a) um escudo de madeira ou (b) qualquer arma simples',
          '(a) uma cimitarra ou (b) qualquer arma corpo a corpo simples',
          'Corselete de couro, um pacote de explorador e um foco druídico'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Feiticeiro',
        description: 'Um conjurador que extrai magia de uma linhagem ou dom inato.',
        hitDie: 6,
        primaryAbility: ['Carisma'],
        savingThrowProficiencies: ['constitution', 'charisma'],
        armorAndWeaponProficiencies: ['Adagas', 'dardos', 'fundas', 'bordões', 'bestas leves'],
        startingEquipmentOptions: [
          '(a) uma besta leve e 20 virotes ou (b) qualquer arma simples',
          '(a) uma bolsa de componentes ou (b) um foco arcano',
          '(a) um pacote de masmorra ou (b) um pacote de explorador',
          'Duas adagas'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Guerreiro',
        description: 'Um mestre do combate, especialista em uma ampla gama de armas e armaduras.',
        hitDie: 10,
        primaryAbility: ['Força', 'Destreza'],
        savingThrowProficiencies: ['strength', 'constitution'],
        armorAndWeaponProficiencies: ['Todas as armaduras', 'escudos', 'armas simples e marciais'],
        startingEquipmentOptions: [
          '(a) cota de malha ou (b) gibão de peles, arco longo e 20 flechas',
          '(a) uma arma marcial e um escudo ou (b) duas armas marciais',
          '(a) uma besta leve e 20 virotes ou (b) duas machadinhas',
          '(a) um pacote de masmorra ou (b) um pacote de explorador'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Ladino',
        description: 'Um gatuno que usa furtividade e subterfúgio para superar obstáculos e inimigos.',
        hitDie: 8,
        primaryAbility: ['Destreza'],
        savingThrowProficiencies: ['dexterity', 'intelligence'],
        armorAndWeaponProficiencies: ['Armaduras leves', 'armas simples', 'bestas de mão', 'espadas longas', 'rapieiras', 'espadas curtas'],
        startingEquipmentOptions: [
          '(a) uma rapieira ou (b) uma espada curta',
          '(a) um arco curto e aljava com 20 flechas ou (b) uma espada curta',
          '(a) um pacote de assaltante, (b) um pacote de masmorra ou (c) um pacote de explorador',
          'Corselete de couro, duas adagas e ferramentas de ladrão'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Mago',
        description: 'Um usuário de magia erudito, capaz de manipular as estruturas da realidade.',
        hitDie: 6,
        primaryAbility: ['Inteligência'],
        savingThrowProficiencies: ['intelligence', 'wisdom'],
        armorAndWeaponProficiencies: ['Adagas', 'dardos', 'fundas', 'bordões', 'bestas leves'],
        startingEquipmentOptions: [
          '(a) um bordão ou (b) uma adaga',
          '(a) uma bolsa de componentes ou (b) um foco arcano',
          '(a) um pacote de estudioso ou (b) um pacote de explorador',
          'Um grimório'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Monge',
        description: 'Um mestre das artes marciais, usando o poder do corpo em busca da perfeição física e espiritual.',
        hitDie: 8,
        primaryAbility: ['Destreza', 'Sabedoria'],
        savingThrowProficiencies: ['strength', 'dexterity'],
        armorAndWeaponProficiencies: ['Armas simples', 'espadas curtas'],
        startingEquipmentOptions: [
          '(a) uma espada curta ou (b) qualquer arma simples',
          '(a) um pacote de masmorra ou (b) um pacote de explorador',
          '10 dardos'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Paladino',
        description: 'Um guerreiro sagrado vinculado a um juramento.',
        hitDie: 10,
        primaryAbility: ['Força', 'Carisma'],
        savingThrowProficiencies: ['wisdom', 'charisma'],
        armorAndWeaponProficiencies: ['Todas as armaduras', 'escudos', 'armas simples e marciais'],
        startingEquipmentOptions: [
          '(a) uma arma marcial e um escudo ou (b) duas armas marciais',
          '(a) cinco azagaias ou (b) qualquer arma corpo a corpo simples',
          '(a) um pacote de sacerdote ou (b) um pacote de aventureiro',
          'Cota de malha e um símbolo sagrado'
        ],
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Patrulheiro',
        description: 'Um guerreiro que usa habilidade marcial e magia da natureza para combater ameaças nos limites da civilização.',
        hitDie: 10,
        primaryAbility: ['Destreza', 'Sabedoria'],
        savingThrowProficiencies: ['strength', 'dexterity'],
        armorAndWeaponProficiencies: ['Armaduras leves e médias', 'escudos', 'armas simples e marciais'],
        startingEquipmentOptions: [
          '(a) brunea ou (b) corselete de couro',
          '(a) duas espadas curtas ou (b) duas armas corpo a corpo simples',
          '(a) um pacote de masmorra ou (b) um pacote de explorador',
          'Um arco longo e uma aljava com 20 flechas'
        ],
        sourceBook: 'Livro do Jogador'
      }
    ];
  }

  getBackgrounds(): Background[] {
    // Todos os antecedentes do Livro do Jogador
    return [
      {
        name: 'Acólito',
        description: 'Você passou sua vida a serviço de um templo para uma divindade ou panteão específico.',
        skillProficiencies: ['Intuição', 'Religião'],
        languages: ['Dois à sua escolha'],
        equipment: ['Um símbolo sagrado (um presente dado a você quando entrou no sacerdócio)', 'um livro de orações ou uma roda de oração', '5 varetas de incenso', 'vestimentas', 'um conjunto de roupas comuns', 'uma bolsa com 15 po'],
        feature: { name: 'Abrigo dos Fiéis', description: 'Você e seus companheiros de aventura podem esperar receber cura e cuidados gratuitos em um templo, santuário ou outra presença estabelecida de sua fé.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Artesão de Guilda',
        description: 'Você é membro de uma guilda de artesãos, hábil em um campo específico e com conexões no mundo do comércio e da manufatura.',
        skillProficiencies: ['Intuição', 'Persuasão'],
        toolProficiencies: ['Um tipo de ferramenta de artesão'],
        languages: ['Um à sua escolha'],
        equipment: ['Um conjunto de ferramentas de artesão (à sua escolha)', 'uma carta de apresentação de sua guilda', 'um conjunto de roupas de viajante', 'uma bolsa com 15 po'],
        feature: { name: 'Membro da Guilda', description: 'Como membro da sua guilda, você tem acesso a certos benefícios. Seus companheiros da guilda fornecerão alojamento e comida, se necessário, e pagarão pelo seu funeral.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Artista',
        description: 'Você prospera na frente de uma plateia. Você conhece como cativar, entreter e até mesmo inspirar os outros.',
        skillProficiencies: ['Acrobacia', 'Atuação'],
        toolProficiencies: ['Kit de disfarce', 'um tipo de instrumento musical'],
        equipment: ['Um instrumento musical (à sua escolha)', 'o favor de um admirador (carta de amor, mecha de cabelo ou bugiganga)', 'um traje', 'uma bolsa com 15 po'],
        feature: { name: 'Por Aclamação Popular', description: 'Você sempre pode encontrar um lugar para se apresentar, geralmente em uma taverna ou estalagem. Você recebe alojamento e comida de graça de status modesto ou confortável (dependendo da qualidade do estabelecimento).' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Charlatão',
        description: 'Você sempre teve um jeito com as pessoas. Você sabe o que as faz funcionar, pode blefar ou manipular seu caminho através de qualquer situação.',
        skillProficiencies: ['Enganação', 'Prestidigitação'],
        toolProficiencies: ['Kit de disfarce', 'kit de falsificação'],
        equipment: ['Um conjunto de roupas finas', 'um kit de disfarce', 'ferramentas do ofício de sua vigarice preferida', 'uma bolsa com 15 po'],
        feature: { name: 'Identidade Falsa', description: 'Você criou uma segunda identidade que inclui documentação, conhecidos estabelecidos e disfarces que permitem que você assuma essa persona.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Criminoso',
        description: 'Você é um criminoso experiente com um histórico de infringir a lei. Você passou muito tempo entre outros criminosos e ainda tem contatos nesse mundo.',
        skillProficiencies: ['Enganação', 'Furtividade'],
        toolProficiencies: ['Um tipo de kit de jogo', 'ferramentas de ladrão'],
        equipment: ['Um pé de cabra', 'um conjunto de roupas escuras comuns com capuz', 'uma bolsa com 15 po'],
        feature: { name: 'Contato Criminal', description: 'Você tem um contato confiável e leal que atua como seu intermediário em uma rede de outros criminosos.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Eremita',
        description: 'Você viveu em reclusão – seja em um abrigo isolado ou em uma comunidade fechada – por um período significativo de sua vida.',
        skillProficiencies: ['Medicina', 'Religião'],
        toolProficiencies: ['Kit de herbalismo'],
        languages: ['Um à sua escolha'],
        equipment: ['Um estojo de pergaminho cheio de notas de seus estudos ou orações', 'um cobertor de inverno', 'um conjunto de roupas comuns', 'um kit de herbalismo', '5 po'],
        feature: { name: 'Descoberta', description: 'A quietude de sua reclusão lhe deu acesso a uma descoberta ou verdade única e poderosa. O conhecimento exato depende da natureza de sua reclusão.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Forasteiro',
        description: 'Você cresceu na selva, longe da civilização e dos confortos da cidade e da tecnologia.',
        skillProficiencies: ['Atletismo', 'Sobrevivência'],
        toolProficiencies: ['Um tipo de instrumento musical'],
        languages: ['Um à sua escolha'],
        equipment: ['Um cajado', 'uma armadilha de caça', 'um troféu de um animal que você matou', 'um conjunto de roupas de viajante', 'uma bolsa com 10 po'],
        feature: { name: 'Andarilho', description: 'Você tem uma memória excelente para mapas e geografia, e sempre pode se lembrar do layout geral de terrenos, assentamentos e outras características ao seu redor.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Herói do Povo',
        description: 'Você vem de uma classe social humilde, mas está destinado a muito mais. O povo comum o adora por seus feitos e o vê como um herói.',
        skillProficiencies: ['Adestrar Animais', 'Sobrevivência'],
        toolProficiencies: ['Um tipo de ferramenta de artesão', 'veículos (terrestres)'],
        equipment: ['Um conjunto de ferramentas de artesão (à sua escolha)', 'uma pá', 'uma panela de ferro', 'um conjunto de roupas comuns', 'uma bolsa com 10 po'],
        feature: { name: 'Destino Rústico', description: 'Você tem uma afinidade com o povo comum. Eles o reconhecem como um deles e o protegerão se puderem, a menos que você se torne um perigo para eles.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Marinheiro',
        description: 'Você navegou em um navio marítimo por anos de sua vida. Nesse tempo, você enfrentou tempestades poderosas, monstros das profundezas e aqueles que saqueiam os mares.',
        skillProficiencies: ['Atletismo', 'Percepção'],
        toolProficiencies: ['Ferramentas de navegador', 'veículos (aquáticos)'],
        equipment: ['Uma cavilha (clava)', '50 pés de corda de seda', 'um amuleto da sorte como um pé de coelho ou uma pequena pedra com um buraco no meio', 'um conjunto de roupas comuns', 'uma bolsa com 10 po'],
        feature: { name: 'Passagem em Navio', description: 'Quando você precisa, pode garantir passagem gratuita em um navio à vela para você e seus companheiros de aventura. Você pode viajar para qualquer porto conhecido.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Nobre',
        description: 'Você entende de riqueza, poder e privilégio. Você carrega um título nobre, e sua família possui terras, arrecada impostos e exerce significativa influência política.',
        skillProficiencies: ['História', 'Persuasão'],
        toolProficiencies: ['Um tipo de kit de jogo'],
        languages: ['Um à sua escolha'],
        equipment: ['Um conjunto de roupas finas', 'um anel de sinete', 'um rolo de pedigree', 'uma bolsa com 25 po'],
        feature: { name: 'Posição de Privilégio', description: 'Graças ao seu nascimento nobre, as pessoas estão inclinadas a pensar o melhor de você. Você é bem-vindo na alta sociedade e as pessoas assumem que você tem o direito de estar onde está.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Órfão',
        description: 'Você cresceu sozinho nas ruas de uma cidade. Você não tinha ninguém para cuidar de você ou para lhe fornecer o básico, então aprendeu a se virar sozinho.',
        skillProficiencies: ['Prestidigitação', 'Furtividade'],
        toolProficiencies: ['Kit de disfarce', 'ferramentas de ladrão'],
        equipment: ['Uma pequena faca', 'um mapa da cidade em que você cresceu', 'um rato de estimação', 'um símbolo para lembrar seus pais', 'um conjunto de roupas comuns', 'uma bolsa com 10 po'],
        feature: { name: 'Segredos da Cidade', description: 'Você conhece as passagens secretas e os padrões de sua cidade natal, e pode encontrar passagens através da cidade duas vezes mais rápido do que o normal.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Sábio',
        description: 'Você passou anos aprendendo o conhecimento do multiverso. Você vasculhou manuscritos, estudou pergaminhos e ouviu os maiores especialistas nos temas que lhe interessam.',
        skillProficiencies: ['Arcanismo', 'História'],
        languages: ['Dois à sua escolha'],
        equipment: ['Um vidro de tinta preta', 'uma pena', 'uma faca pequena', 'uma carta de um colega morto com uma pergunta que você ainda não conseguiu responder', 'um conjunto de roupas comuns', 'uma bolsa com 10 po'],
        feature: { name: 'Pesquisador', description: 'Quando você tenta aprender ou lembrar de uma informação, se você não a conhece, muitas vezes sabe onde e de quem pode obtê-la.' },
        sourceBook: 'Livro do Jogador'
      },
      {
        name: 'Soldado',
        description: 'A guerra tem sido sua vida pelo tempo que você pode se lembrar. Você treinou como um jovem, estudou o uso de armas e armaduras, aprendeu técnicas básicas de sobrevivência e como se manter em um campo de batalha.',
        skillProficiencies: ['Atletismo', 'Intimidação'],
        toolProficiencies: ['Um tipo de kit de jogo', 'veículos (terrestres)'],
        equipment: ['Uma insígnia de patente', 'um troféu tirado de um inimigo caído', 'um conjunto de dados de osso ou baralho de cartas', 'um conjunto de roupas comuns', 'uma bolsa com 10 po'],
        feature: { name: 'Patente Militar', description: 'Você ainda é reconhecido por sua patente por soldados e veteranos da mesma organização militar. Você pode invocar sua patente para exercer influência sobre soldados e requisitar equipamento simples para uso temporário.' },
        sourceBook: 'Livro do Jogador'
      }
    ];
  }

  // --- LÓGICA DOS VALORES DE HABILIDADE ---
  rollAbilityScores(): number[] {
    const scores: number[] = [];
    for (let i = 0; i < 6; i++) {
      const rolls: number[] = [];
      for (let j = 0; j < 4; j++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
      }
      rolls.sort((a, b) => b - a); // Ordena em ordem decrescente
      const sum = rolls.slice(0, 3).reduce((acc, val) => acc + val, 0); // Soma os 3 maiores
      scores.push(sum);
    }
    return scores;
  }

  getStandardArray(): number[] {
    return [15, 14, 13, 12, 10, 8];
  }

  calculatePointBuyCost(score: number): number {
    if (score < 8) return 0; // Custo não é negativo, mas o valor não pode ser menor que 8 na compra.
    if (score > 15) return 999; // Custo muito alto para indicar que não é permitido
    if (score <= 13) return score - 8;
    if (score === 14) return 7; // 5 (para 13) + 2
    if (score === 15) return 9; // 7 (para 14) + 2
    return 0;
  }

  // --- LÓGICA DE EQUIPAMENTO ---
  getStartingEquipment(className: string | undefined, backgroundName: string | undefined): string[] {
    let combinedEquipment: string[] = [];

    // Adiciona equipamento da Classe
    if (className) {
      const selectedClass = this.getClasses().find(c => c.name === className);
      if (selectedClass && selectedClass.startingEquipmentOptions) {
        // Para este exemplo, apenas listamos as opções. Uma implementação completa
        // exigiria uma interface de usuário para o jogador fazer as escolhas.
        combinedEquipment.push(...selectedClass.startingEquipmentOptions);
      }
    }

    // Adiciona equipamento do Antecedente
    if (backgroundName) {
      const selectedBackground = this.getBackgrounds().find(b => b.name === backgroundName);
      if (selectedBackground && selectedBackground.equipment) {
        combinedEquipment.push(...selectedBackground.equipment);
      }
    }

    return combinedEquipment;
  }
}