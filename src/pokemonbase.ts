/**
 * @module
 */
import constants from './constants.js';
import { DataManagerBase, LevelTrigger, Species, StatStages } from './models.js';

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
/**
 * Represents a base Pokemon instance.
 * 
 * @class PokemonBase
 * @property {any} id - Unique identifier for the Pokemon.
 * @property {string|number} owner_id - ID of the Pokemon's owner. 
 * @property {number} idx - Index of the Pokemon within the owner's collection. 
 * @property {number} [timestamp] - Timestamp of when the Pokemon was created or obtained.
 * @property {number} species_id - ID of the Pokemon species. 
 * @property {number} level - Current level of the Pokemon.
 * @property {number} xp - Current experience points of the Pokemon. 
 * @property {string} nature - Nature of the Pokemon, which affects stat growth. 
 * @property {boolean} shiny - Whether the Pokemon is shiny.
 * @property {number} iv_hp - Individual Value (IV) for HP.
 * @property {number} iv_atk - Individual Value (IV) for Attack.
 * @property {number} iv_defn - Individual Value (IV) for Defense.
 * @property {number} iv_satk - Individual Value (IV) for Special Attack.
 * @property {number} iv_sdef - Individual Value (IV) for Special Defense.
 * @property {number} iv_spd - Individual Value (IV) for Speed.
 * @property {number} iv_total - Sum of all IVs. 
 * @property {string|undefined} nickname - Nickname of the Pokemon, or undefined if none. 
 * @property {string|false} favorite - Favorite status of the Pokemon. 
 * @property {number|string|undefined} held_item - ID or name of the held item, or undefined if none. 
 * @property {any} moves - List of moves the Pokemon knows.
 * @property {boolean|false} has_color - Whether the Pokemon has a custom color.
 * @property {number|undefined} color - Custom color of the Pokemon, or undefined if none. 
 * @property {number|null} _hp - Current HP of the Pokemon.
 * @property {string[]|number[]|[]} ailments - List of ailments affecting the Pokemon.
 * @property {any} stages - Stat stage modifications affecting the Pokemon.
 */

class PokemonBase implements PokemonBaseDef {
  [key: string]: any;

  id: any;

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

  moves: any;

  has_color: boolean | false;

  color: number | undefined;

  _hp: number | null;

  ailments: string[] | number[] | [];

  stages: StatStages;

  instance: DataManagerBase[]

  constructor(data: Species, instance: DataManagerBase) {
      this.id = data.id;
      this.idx =  1;
      this.species_id = data.id;
      this.level =  0;
      this.xp =  0;
      this.nature =  random_nature();
      this.shiny = Math.floor(Math.random() * 4096) == 1 ? true : false
      this.iv_hp =  random_iv();
      this.iv_atk = random_iv();
      this.iv_defn =  random_iv();
      this.iv_satk =  random_iv();
      this.iv_sdef =  random_iv();
      this.iv_spd =  random_iv();

      this.iv_total = this.iv_hp + this.iv_defn + this.iv_satk + this.iv_atk + this.iv_sdef + this.iv_spd

      // Customization
      this.nickname = null;
      this.favorite =  false;
      this.held_item =  null;
      this.moves = data.moves || [];
      this.has_color =  false;
      this.color =  null;

      this._hp = null;
      this.ailments = [];
      this.stages = new StatStages();
      this.instance = [instance]
  }

  format(spec: string) {
      let name = this.shiny ? '✨ ' : '';
      name += this.species.toString();
      return name;
  }

  toString() {
      return this.format('');
  }
  toJSON() {
    const copy = { ...this };
    delete copy.instance
    return copy;
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

  get species() {
		return this.instance[0].findSpeciesByNumber(this.species_id);
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
