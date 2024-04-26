/**
 * @module
 */
import constants from './constants.js';
import { LevelTrigger } from './models.js';

import { type PokemonBaseDef } from '../index.js';

const random_iv = () => Math.floor(Math.random() * 32);
const random_nature = () =>
    constants.NATURES[Math.floor(Math.random() * constants.NATURES.length)];

// Function to calculate stats
function calcStat(pokemon: PokemonBase, stat: string): number {
    const ivstat = `iv_${stat}`;
    const base = pokemon.species.base_stats[stat];
    const iv = pokemon[ivstat];
    return Math.floor(
        (((2 * base + iv + 5) * pokemon.level) / 100 + 5) *
      constants.NATURE_MULTIPLIERS[pokemon.nature][stat]
    );
}

class PokemonBase implements PokemonBaseDef {
  [key: string]: any;

  id: any;

  owner_id: string | number;

  idx: number;

  timestamp?: number;

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

  moves: any;

  has_color: boolean | false;

  color: number | undefined;

  _hp: number | null;

  ailments: string[] | number[] | [];

  stages: any;

  constructor(data: any) {
      this.id = data.id;
      this.timestamp = data.timestamp || new Date();
      this.owner_id = data.owner_id;
      this.idx = data.idx;
      this.species_id = data.species_id;
      this.level = data.level;
      this.xp = data.xp;
      this.nature = data.nature;
      this.shiny = data.shiny;
      this.iv_hp = data.iv_hp;
      this.iv_atk = data.iv_atk;
      this.iv_defn = data.iv_defn;
      this.iv_satk = data.iv_satk;
      this.iv_sdef = data.iv_sdef;
      this.iv_spd = data.iv_spd;

      this.iv_total = data.iv_total;

      // Customization
      this.nickname = data.nickname || null;
      this.favorite = data.favorite || false;
      this.held_item = data.held_item || null;
      this.moves = data.moves || [];
      this.has_color = data.has_color || false;
      this.color = data.color || null;

      this._hp = null;
      this.ailments = [];
      this.stages = null;
  }

  format(spec: string) {
      let name = this.shiny ? '✨ ' : '';
      name += this.species.toString();
      return name;
  }

  toString() {
      return this.format('');
  }

  get max_xp() {
      return 500 + 30 * this.level;
  }

  get max_hp() {
      if (this.species_id === 292) {
          return 1;
      }

      return Math.floor(
          ((2 * this.species.base_stats.hp + this.iv_hp + 5) * this.level) / 100 +
        this.level +
        10
      );
  }

  get hp() {
      return this._hp === null ? this.max_hp : this._hp;
  }

  set hp(value) {
      this._hp = value;
  }

  get atk() {
      return calcStat(this, 'atk');
  }

  get defn() {
      return calcStat(this, 'defn');
  }

  get satk() {
      return calcStat(this, 'satk');
  }

  get sdef() {
      return calcStat(this, 'sdef');
  }

  get spd() {
      return calcStat(this, 'spd');
  }

  get ivPercentage() {
      return (
          (this.iv_hp +
        this.iv_atk +
        this.iv_defn +
        this.iv_satk +
        this.iv_sdef +
        this.iv_spd) /
      (6 * 31)
      );
  }

  getNextEvolution() {
      if (!this.species.evolution_to || this.held_item === 13001) {
          return null;
      }

      const possible = [];

      for (const evo of this.species.evolution_to.items) {
          if (!(evo.trigger instanceof LevelTrigger)) {
              continue;
          }

          let can = true;

          if (evo.trigger.level && this.level < evo.trigger.level) {
              can = false;
          }

          if (evo.trigger.item && this.held_item !== evo.trigger.item_id) {
              can = false;
          }

          if (evo.trigger.move_id && !this.moves.includes(evo.trigger.move_id)) {
              can = false;
          }

          if (evo.trigger.relative_stats === 1 && this.atk <= this.defn) {
              can = false;
          }

          if (evo.trigger.relative_stats === -1 && this.defn <= this.atk) {
              can = false;
          }

          if (evo.trigger.relative_stats === 0 && this.atk !== this.defn) {
              can = false;
          }

          if (can) {
              possible.push(evo.target);
          }
      }

      if (possible.length === 0) {
          return null;
      }

      return possible[Math.floor(Math.random() * possible.length)];
  }

  canEvolve() {
      return this.getNextEvolution() !== null;
  }
}

export { PokemonBase, calcStat };
