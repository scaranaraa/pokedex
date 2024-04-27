import {
    type DataManagerBase,
    type Evolution,
    type EvolutionList,
    type EvolutionTrigger,
    type Item,
    type Move,
    type MoveEffect,
    type MoveMeta,
    type MoveMethod,
    type MoveResult,
    type PokemonMove,
    type Species,
    type StatChange,
    type Stats,
    type StatStages,
} from './dist/models.js';
import DataManager from './dist/init.js';
import { PokemonBase } from './dist/pokemonbase.js';
export { DataManager as Pokedex };
export { PokemonBase as Pokemon };

export type StatsBase = {
  hp: number;
  atk: number;
  defn: number;
  satk: number;
  sdef: number;
  spd: number;
};

export type StatChangeBase = {
  stat_id: number;
  change: number;
  stat: string;
};

export type StatStagesBase = {
  hp: number;
  atk: number;
  defn: number;
  satk: number;
  sdef: number;
  spd: number;
  evasion: number;
  accuracy: number;
  crit: number;

  update(stages: StatStages): void;
};

export type SpeciesBase = {
  id: number;
  names: string[][];
  slug: string;
  base_stats: Stats;
  height: number;
  weight: number;
  dex_number: number;
  catchable: boolean;
  types: string[];
  abundance: number;
  gender_rate: number;
  has_gender_differences: boolean;
  description: string | undefined;
  mega_id: number | undefined;
  mega_x_id: number | undefined;
  mega_y_id: number | undefined;
  evolution_from: EvolutionList | undefined;
  evolution_to: EvolutionList | undefined;
  mythical: boolean;
  legendary: boolean;
  ultra_beast: boolean;
  event: boolean;
  is_form: boolean;
  form_item: number | undefined;
  region: string;
  art_credit: string | undefined;
  instance: DataManagerBase;
  moves: PokemonMove[] | [];
  name: string | undefined;

  toString(): string | undefined;

  moveset: Move[];
  mega: undefined | Species;
  mega_x: undefined | Species;
  mega_y: undefined | Species;

  correct_guesses: Array<string | string[]>;
  trade_evolutions: Evolution[];
  evolution_text: string | undefined;
};

export type EvolutionTriggerBase = Record<string, unknown>;

export type LevelTriggerBase = {
  level: number;
  item_id: number;
  move_id: number;
  move_type_id: number;
  time: string;
  relative_stats: number;
  instance: DataManagerBase;

  item: Item | undefined;
  move: Move | undefined;
  move_type: string | undefined;
  text: string;
} & EvolutionTriggerBase;

export type ItemTriggerBase = {
  item_id: number;
  instance: DataManagerBase;

  item: Item;
  text: string;
} & EvolutionTriggerBase;

export type TradeTriggerBase = {
  item_id: number | undefined;
  instance: DataManagerBase;

  item: Item | undefined;
  text: string;
} & EvolutionTriggerBase;

export type OtherTriggerBase = {
  instance: DataManagerBase;
  text: string;
} & EvolutionTriggerBase;

export type MoveEffectBase = {
  id: number;
  description: string;
  instance: DataManagerBase; // to change
  format(): string;
};

export type MoveMetaBase = {
  meta_category_id: number;
  meta_ailment_id: string;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
  min_hits: number | undefined;
  max_hits: number | undefined;
  min_turns: number | undefined;
  max_turns: number | undefined;
  stat_changes: StatChange[] | [];
  meta_category: string;
  meta_ailment: string;
};

export type MoveResultBase = {
  success: boolean;
  damage: number;
  healing: number;
  ailment: string | undefined;
  messages: string[];
  stat_changes: StatChange[];
};

export type MoveBase = {
  id: number;
  slug: string;
  name: string;
  power: number;
  pp: number;
  accuracy: number;
  priority: number;
  target_id: number;
  type_id: number;
  damage_class_id: number;
  effect_id: number;
  effect_chance: number;
  meta: MoveMeta;
  effect: MoveEffect;
  instance: DataManagerBase;
  type: string | undefined;
  target_text: string | undefined;
  damage_class: string | undefined;
  description: string | undefined;

  calculate_turn(pokemon: PokemonBase, opponent: PokemonBase): MoveResult;
};

export type MoveMethodBase = {
  level?: number;
};

export type LevelMethodBase = {
  level: number;
  instance: any;
  text: string;
} & MoveMethodBase;

export type PokemonMoveBase = {
  move_id: number;
  method: MoveMethod;
  instance: DataManagerBase;
  move: Move;
  calc_turn(pokemon: PokemonBase, opponent: PokemonBase): MoveResult
  text: string;
};

export type ItemBase = {
  id: number;
  name: string;
  description: string;
  cost: number;
  page: number;
  action: string;
  inline: boolean;
  emote: string | undefined;
  shard: boolean;
  instance: DataManagerBase;

  toString(): string;
};

export type EvolutionBase = {
  target_id: number;
  trigger: EvolutionTrigger;
  type: boolean;
  instance: DataManagerBase;

  dir: string;
  target: Species;
  text: string;

  evolve_from(
    target: number,
    trigger: EvolutionTrigger,
    instance: DataManagerBase
  ): Promise<Evolution>;

  evolve_to(
    target: number,
    trigger: EvolutionTrigger,
    instance: DataManagerBase
  ): Promise<Evolution>;
};

export type EvolutionListBase = {
  items: Evolution[];
  text: string;
};

export type PokemonBaseDef = {
  [key: string]: any;

  id: number;
  idx: number;
  species_id: number;
  level: number;
  xp: number;
  nature: string;
  shiny: boolean;
  iv_hp: number;
  iv_atk: number;
  iv_defn: number;
  iv_satk: number;
  iv_sdef: number;
  iv_spd: number;

  iv_total: number;

  nickname: string | undefined;
  favorite: string | false;
  held_item: number | string | undefined;
  moves: PokemonMove[];
  has_color: boolean | false;
  color: number | undefined;

  _hp?: number | null;
  ailments: string[] | number[]
  stages: any;

  format(spec: string): string;

  toString(): string;

  max_xp: number;
  max_hp: number;

  get hp(): number;

  atk: number;
  defn: number;

  set hp(value: number);

  satk: number;
  sdef: number;
  spd: number;
  ivPercentage: number;

  getNextEvolution(): Species | undefined;

  canEvolve(): boolean;
};

export type DataManagerBaseType = {
  pokemon: {
    [key: number]: Species;
  };
  items: {
    [key: number]: Item;
  };
  effects: {
    [key: number]: MoveEffect;
  };
  moves: {
    [key: number]: Move;
  };
  
  allPokemon: () => Species[];
 
  list_alolan: number[];
 
  list_galarian: number[];
  
  list_hisuian: number[];
  
  list_paradox: number[];
  
  list_mythical: number[];
  
  list_legendary: number[];

  list_ub: number[];

  list_event: number[];

  list_mega: Array<number | undefined>;

  species_id_by_type_index: Record<string, number[]>;
  speciesIdByRegionIndex: Map<string, number[]>;
  listRegion: (region: string) => number[];
  speciesIdByMoveIndex: Map<number, number[]>;
  listMove: (move: string) => number[];
  allItems: () => Item[];
  allSpeciesByNumber: (number: number) => Species[];
  allSpeciesByName: (name: string) => Species[];
  findSpeciesByNumber: (number: number) => Species;
  speciesByName: (name: string) => Species;
  speciesByNameIndex: Map<string, Species[]>;
  checkinitialized(): void;
  itemByNumber(number: number): Item;

  itemByNameIndex: Map<string, Item>;

  itemByName(name: string): Item;

  moveByNumber(number: number): Move;

  moveByNameIndex: Map<string, Move>;

  moveByName(name: string): Move;

  randomSpawn(rarity?: string): Species;

  weightedRandomChoice(weights: number[]): number;

  spawnWeights: number[];
};

export interface IEvolution {
  id: number;
  evolved_species_id: number;
  evolution_trigger_id: number;
  trigger_item_id: number | null;
  minimum_level: number | null;
  gender_id: number | null;
  location_id: number | null;
  held_item_id: number | null;
  time_of_day: string | null;
  known_move_id: number | null;
  known_move_type_id: number | null;
  minimum_happiness: number | null;
  minimum_beauty: number | null;
  minimum_affection: number | null;
  relative_physical_stats: number | null;
  party_species_id: number | null;
  party_type_id: number | null;
  trade_species_id: number | null;
  needs_overworld_rain: number;
  turn_upside_down: number;
}

export interface IItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  shard: number | null;
  action: string;
  page: number;
  emote: string | null;
  seperate?: number;
}

export interface MoveEffectProse {
  move_effect_id: number;
  local_language_id: number;
  short_effect: string;
  effect: string;
}
export interface MoveMetaStatChanges {
  move_id: number;
  stat_id: number;
  change: number;
}

export interface IMoveMeta {
  move_id: number;
  meta_category_id: number;
  meta_ailment_id: number;
  min_hits: number | null;
  max_hits: number | null;
  min_turns: number | null;
  max_turns: number | null;
  drain: number;
  healing: number;
  crit_rate: number;
  ailment_chance: number;
  flinch_chance: number;
  stat_chance: number;
}

export interface IMoveNames {
  move_id: number;
  local_language_id: number;
  name: string;
}

export interface IMove {
  id: number;
  identifier: string;
  generation_id: number;
  type_id: number;
  power: number | null;
  pp: number;
  accuracy: number | null;
  priority: number;
  target_id: number;
  damage_class_id: number;
  effect_id: number;
  effect_chance: number | null;
  contest_type_id: number | null;
  contest_effect_id: number | null;
  super_contest_effect_id: number | null;
}

export interface IPokemonMove {
  pokemon_id: number;
  version_group_id: number;
  move_id: number;
  pokemon_move_method_id: number;
  level: number;
  order: number;
}

export interface IPokemon {
  id: string;
  dex_number: string;
  region: string;
  slug: string;
  description: string;
  credit?: string | null;
  enabled?: string;
  catchable: string;
  abundance: string;
  gender_rate: string;
  has_gender_differences: string;
  'name.ja'?: string;
  'name.ja_r'?: string;
  'name.ja_t'?: string;
  'name.en'?: string;
  'name.en2'?: string | null;
  'name.de'?: string;
  'name.fr'?: string;
  'type.0'?: string;
  'type.1'?: string | null;
  mythical: string;
  legendary: string;
  ultra_beast: string;
  event: string;
  height: string;
  weight: string;
  'evo.to': string | null;
  'evo.from': string | null;
  'base.hp': string;
  'base.atk': string;
  'base.def': string;
  'base.satk': string;
  'base.sdef': string;
  'base.spd': string;
  'evo.mega': string | null;
  'evo.mega_x': string | null;
  'evo.mega_y': string | null;
  is_form: string;
  form_item: string | null;
}
