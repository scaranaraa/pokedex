/**
 * @module
 */
import constants from './constants.js';
import { PokemonBase } from './pokemonbase.js';
import {
    type DataManagerBaseType,
    type EvolutionBase,
    type EvolutionListBase,
    type EvolutionTriggerBase,
    type ItemBase,
    type ItemTriggerBase,
    type LevelMethodBase,
    type LevelTriggerBase,
    type MoveBase,
    type MoveEffectBase,
    type MoveMetaBase,
    type MoveMethodBase,
    type MoveResultBase,
    type OtherTriggerBase,
    type PokemonMoveBase,
    type SpeciesBase,
    type StatChangeBase,
    type StatsBase,
    type StatStagesBase,
    type TradeTriggerBase,
} from '../index.js';

function deaccent(text: string) {
    const norm = text.normalize('NFD');
    const result = Array.from(norm)
        .filter(ch => !/[\u0300-\u036f]/.test(ch))
        .join('');
    return result.normalize('NFKC');
}

class UnregisteredError extends Error {}

/**
 * Represents the effect of a Pokemon move.
 *
 * @class MoveEffect
 * @property {number} id - The ID of the move effect.
 * @property {string} description - The description of the move effect.
 * @property {DataManagerBase} instance - The DataManagerBase instance.
 */
class MoveEffect implements MoveEffectBase {
    id: number;

    description: string;

    instance: DataManagerBase;

    constructor(
        id: number,
        description: string,
        instance: DataManagerBase
    ) {
        this.id = id;
        this.description = description;
        this.instance = instance;
    }

    format(): string {
        return this.description;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}
/**
 * Represents a change to a Pokemon's stat stages.
 *
 * @class StatChange
 * @property {number} stat_id - The ID of the stat that is being changed.
 * @property {number} change - The amount by which the stat stage is being changed.
 */
class StatChange implements StatChangeBase {
    stat_id: number;

    change: number;

    constructor(stat_id: number, change: number) {
        this.stat_id = stat_id;
        this.change = change;
    }

    get stat() {
        return ['hp', 'atk', 'defn', 'satk', 'sdef', 'spd', 'evasion', 'accuracy'][
            this.stat_id - 1
        ];
    }
}
/**
 * Represents the stat stages of a Pokemon.
 *
 * @class StatStages
 * @property {number} hp - The HP stat stage.
 * @property {number} atk - The Attack stat stage.
 * @property {number} defn - The Defense stat stage.
 * @property {number} satk - The Special Attack stat stage.
 * @property {number} sdef - The Special Defense stat stage.
 * @property {number} spd - The Speed stat stage.
 * @property {number} evasion - The evasion stat stage.
 * @property {number} accuracy - The accuracy stat stage.
 * @property {number} crit - The critical hit rate stat stage.
 */
class StatStages implements StatStagesBase {
    hp: number;

    atk: number;

    defn: number;

    satk: number;

    sdef: number;

    spd: number;

    evasion: number;

    accuracy: number;

    crit: number;

    constructor(
        hp = 0,
        atk = 0,
        defn = 0,
        satk = 0,
        sdef = 0,
        spd = 0,
        evasion = 0,
        accuracy = 0,
        crit = 0
    ) {
        this.hp = hp;
        this.atk = atk;
        this.defn = defn;
        this.satk = satk;
        this.sdef = sdef;
        this.spd = spd;
        this.evasion = evasion;
        this.accuracy = accuracy;
        this.crit = crit;
    }

    update(stages: StatStagesBase) {
        this.hp += stages.hp;
        this.atk += stages.atk;
        this.defn += stages.defn;
        this.satk += stages.satk;
        this.sdef += stages.sdef;
        this.spd += stages.spd;
        this.evasion += stages.evasion;
        this.accuracy += stages.accuracy;
        this.crit += stages.crit;
    }
}
/**
 * Represents the results of a Pokemon move being used.
 *
 * @class MoveResult
 * @property {boolean} success - Whether the move was successful.
 * @property {number} damage - The amount of damage dealt by the move.
 * @property {number} healing - The amount of HP healed by the move.
 * @property {string|null} ailment - The ailment inflicted by the move, or null if none.
 * @property {string[]} messages - Additional messages about the move's effect.
 * @property {StatChange[]} stat_changes - A list of stat changes caused by the move.
 */
class MoveResult implements MoveResultBase {
    success: boolean;

    damage: number;

    healing: number;

    ailment: string | undefined;

    messages: string[];

    stat_changes: any;

    constructor(
        success: boolean,
        damage: number,
        healing: number,
        ailment: string | undefined,
        messages: string[],
        stat_changes: StatChange[]
    ) {
        this.success = success;
        this.damage = damage;
        this.healing = healing;
        this.ailment = ailment || null;
        this.messages = messages;
        this.stat_changes = stat_changes;
    }
}
/**
 * Additional information about the mechanics of a Pokemon move.
 *
 * @class MoveMeta
 * @property {number} meta_category_id - The ID of the move's meta category (e.g., damage dealing, status inflicting).
 * @property {string} meta_ailment_id - The ID of the ailment that the move can inflict.
 * @property {number} drain - The damage dealt that is healed back to the user.
 * @property {number} healing - Thethe user's max HP that is healed.
 * @property {number} crit_rate - The additional critical hit rate of the move.
 * @property {number} ailment_chance - The chance that the move will inflict an ailment.
 * @property {number} flinch_chance - The chance that the move will cause the target to flinch.
 * @property {number} stat_chance - The chance that the move will cause a stat change.
 * @property {number|null} min_hits - The minimum number of times the move can hit, or null if it always hits once.
 * @property {number|null} max_hits - The maximum number of times the move can hit, or null if it always hits once.
 * @property {number|null} min_turns - The minimum number of turns the move's effect lasts, or null if it lasts one turn.
 * @property {number|null} max_turns - The maximum number of turns the move's effect lasts, or null if it lasts one turn.
 * @property {StatChange[]} stat_changes - A list of stat changes that the move can cause.
 */
class MoveMeta implements MoveMetaBase {
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

    constructor(
        meta_category_id: number,
        meta_ailment_id: string,
        drain: number,
        healing: number,
        crit_rate: number,
        ailment_chance: number,
        flinch_chance: number,
        stat_chance: number,
        min_hits: number | undefined = null,
        max_hits: number | undefined = null,
        min_turns: number | undefined = null,
        max_turns: number | undefined = null,
        stat_changes: StatChange[] | [] = []
    ) {
        this.meta_category_id = meta_category_id;
        this.meta_ailment_id = meta_ailment_id;
        this.drain = drain;
        this.healing = healing;
        this.crit_rate = crit_rate;
        this.ailment_chance = ailment_chance;
        this.flinch_chance = flinch_chance;
        this.stat_chance = stat_chance;
        this.min_hits = min_hits;
        this.max_hits = max_hits;
        this.min_turns = min_turns;
        this.max_turns = max_turns;
        this.stat_changes = stat_changes || [];
    }

    get meta_category() {
        return constants.MOVE_META_CATEGORIES[this.meta_category_id];
    }

    get meta_ailment() {
        return constants.MOVE_AILMENTS[this.meta_ailment_id];
    }

}

/**
 * Represents a Pokemon move. 
 *
 * @class Move
 * @property {number} id - The ID of the move. 
 * @property {string} slug - The slug for the move
 * @property {string} name - The name of the move. 
 * @property {number|null} power - The power of the move, or null if it doesn't deal damage.
 * @property {number} pp - The number of Power Points (PP) the move has. 
 * @property {number|null} accuracy - The accuracy of the move, or null if it never misses. 
 * @property {number} priority - The priority of the move (higher values go first). 
 * @property {number} target_id - The ID of the move's target (e.g., one opponent, all Pokemon).
 * @property {number} type_id - The ID of the move's type (e.g., Electric, Fire).
 * @property {number} damage_class_id - The ID of the move's damage class (e.g., Physical, Special, Status).
 * @property {number} effect_id - The ID of the move's effect.
 * @property {number|null} effect_chance - The chance that the move's effect will occur, or null if it always occurs.
 * @property {MoveMeta} meta - Additional information about the move's mechanics.
 * @property {DataManagerBase} instance - The DataManagerBase instance
 */ 
class Move implements MoveBase {
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

    instance: DataManagerBase;

    constructor(
        id: number,
        slug: string,
        name: string,
        power: number,
        pp: number,
        accuracy: number,
        priority: number,
        target_id: number,
        type_id: number,
        damage_class_id: number,
        effect_id: number,
        effect_chance: number,
        meta: MoveMeta,
        instance: DataManagerBase
    ) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.power = power;
        this.pp = pp;
        this.accuracy = accuracy;
        this.priority = priority;
        this.target_id = target_id;
        this.type_id = type_id;
        this.damage_class_id = damage_class_id;
        this.effect_id = effect_id;
        this.effect_chance = effect_chance;
        this.meta = meta;
        this.instance = instance;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
    get type() {
        return constants.TYPES[this.type_id];
    }

    get target_text() {
        return constants.MOVE_TARGETS[this.target_id];
    }

    get damage_class() {
        return constants.DAMAGE_CLASSES[this.damage_class_id];
    }

    get effect() {
        return this.instance.effects[this.effect_id];
    }

    get description() {
        return this.effect.description;
    }
    /** 
    * Simulate a fight between two pokemon instances
    * @param {PokemonBase} pokemon - The pokemon performing the move
    * @param {PokemonBase} opponent - Opponent pokemon
    * @returns {MoveResult} The result of a move.
    */
    calculate_turn(pokemon: PokemonBase, opponent: PokemonBase): MoveResult {
        let success;
        let damage = 0;
        let hits = 0;
        if (this.damage_class_id == 1 || this.power === null) {
            success = true;
            damage = 0;
            hits = 0;
        } else {
            success =
        Math.random() <
        (Number(this.accuracy || 0) *
          (constants.STAT_STAGE_MULTIPLIERS[String(pokemon.stages.accuracy)] *
            2 +
            1)) /
          (Number(
              constants.STAT_STAGE_MULTIPLIERS[String(opponent.stages.evasion)]
          ) *
            2 +
            1);
            hits =
        Math.floor(
            Math.random() *
            (Number(this.meta.max_hits || 1) -
              Number(this.meta.min_hits || 1) +
              1)
        ) + Number(this.meta.min_hits || 1);
            let atk = 0;
            let defn = 0;
            if (this.damage_class_id == 2) {
                atk =
          Number(pokemon.atk) *
          Number(constants.STAT_STAGE_MULTIPLIERS[String(pokemon.stages.atk)]);
                defn =
          Number(opponent.defn) *
          Number(
              constants.STAT_STAGE_MULTIPLIERS[String(opponent.stages.defn)]
          );
            } else {
                atk =
          Number(pokemon.satk) *
          Number(constants.STAT_STAGE_MULTIPLIERS[String(pokemon.stages.satk)]);
                defn =
          Number(opponent.sdef) *
          Number(
              constants.STAT_STAGE_MULTIPLIERS[String(opponent.stages.sdef)]
          );
            }

            damage = Math.floor(
                (((2 * Number(pokemon.level)) / 5 + 2) * Number(this.power) * atk) /
          defn /
          50 +
          2
            );
        }

        let healing = (Number(damage) * Number(this.meta.drain)) / 100;
        healing += (Number(pokemon.max_hp) * Number(this.meta.healing)) / 100;
        for (const ailment of pokemon.ailments) {
            if (ailment === 'Paralysis') {
                if (Math.random() < 0.25) {
                    success = false;
                }
            } else if (ailment === 'Sleep') {
                if (![173, 214].includes(this.id)) {
                    success = false;
                }
            } else if (ailment === 'Freeze') {
                if (![588, 172, 221, 293, 503, 592].includes(this.id)) {
                    success = false;
                }
            } else if (ailment === 'Burn') {
                if (this.damage_class_id === 2) {
                    damage /= 2;
                }
            }
        }

        const ailment: string | undefined =
      Math.random() < this.meta.ailment_chance ? this.meta.meta_ailment : null;
        let typ_mult = 1;
        for (const typ of opponent.species.types) {
            try {
                const mult: undefined | Array<undefined | number> =
          constants.TYPE_EFFICACY[this.type_id];
                if (mult) {
                    const multi = mult[constants.TYPES.indexOf(typ)];
                    typ_mult *= multi || 1;
                }
            } catch (error) {}
        }

        damage *= Number(typ_mult);
        const messages = [];
        if (typ_mult == 0) {
            messages.push('It\'s not effective...');
        } else if (typ_mult > 1) {
            messages.push('It\'s super effective!');
        } else if (typ_mult < 1) {
            messages.push('It\'s not very effective...');
        }

        if (hits > 1) {
            messages.push(`It hit ${hits} times!`);
        }

        const changes = [];
        for (const change of this.meta.stat_changes) {
            if (Math.random() < this.meta.stat_chance) {
                changes.push(change);
            }
        }

        if (this.type && this.type in pokemon.species.types) {
            damage *= 1.5;
        }

        return new MoveResult(
            success,
            Number(damage),
            Number(healing),
            ailment,
            messages,
            changes
        );
    }
}
/**
 * Represents an item. 
 *
 * @class Item 
 * @property {number} id - The ID of the item.
 * @property {string} name - The name of the item. 
 * @property {string|null} description - The description of the item, or null if none. 
 * @property {number} cost - The cost of the item in PokeDollars. 
 * @property {number} page - The page number in the bag where the item is found.
 * @property {string} action - The action that is performed when the item is used. 
 * @property {boolean} inline - Whether the item is used inline (without opening the bag). 
 * @property {string|null} emote - The emote associated with using the item, or null if none.
 * @property {boolean} shard - Whether the item is a shard. 
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this item. 
 */
class Item implements ItemBase {
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

    constructor(
        id: number,
        name: string,
        description: string,
        cost: number,
        page: number,
        action: string,
        inline: boolean,
        emote: string | undefined = null,
        shard = false,
        instance: DataManagerBase
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.page = page;
        this.action = action;
        this.inline = inline;
        this.emote = emote;
        this.shard = shard;
        this.instance = instance;
    }

    toString() {
        return this.name;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}

/**
 * Represents a method by which a Pokemon can learn a move.
 *
 * @class MoveMethod
 */
class MoveMethod implements MoveMethodBase {}

/**
 * Represents the method of learning a move by leveling up. 
 * 
 * @class LevelMethod
 * @extends MoveMethod
 * @property {number} level - The level at which the Pokemon learns the move. 
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this move method. 
 */ 
class LevelMethod extends MoveMethod implements LevelMethodBase {
    level: number;

    instance: DataManagerBaseType;

    constructor(level: number, instance: DataManagerBase) {
        super();
        this.level = level;
        this.instance = instance;
    }

    get text() {
        return `Level ${this.level}`;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}
/**
 * Represents a move that a Pokemon can learn, along with the method for learning it.
 * 
 * @class PokemonMove
 * @property {number} move_id - The ID of the move that the Pokemon can learn.
 * @property {MoveMethod} method - The method by which the Pokemon learns the move.
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this Pokemon move.
 */
class PokemonMove implements PokemonMoveBase {
    constructor(move_id: number, method: MoveMethod, instance: DataManagerBase) {
        this.move_id = move_id;
        this.method = method;
        this.instance = instance;
    }

    move_id: number;

    method: MoveMethod;

    instance: DataManagerBase;

    get move() {
        return this.instance.moves[this.move_id];
    }

    get text() {
        return `Move ${this.method}`;
    }

    /** 
    * Simulate a fight between two pokemon instances
    * @param {PokemonBase} pokemon - The pokemon performing the move
    * @param {PokemonBase} opponent - Opponent pokemon
    * @returns {MoveResult} The result of a move.
    */
    calc_turn(pokemon: PokemonBase, opponent: PokemonBase): MoveResult {
        return this.move.calculate_turn(pokemon, opponent)
    }

    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}

/**
 * Represents the trigger for an evolution.
 * 
 * @class EvolutionTrigger 
 */
class EvolutionTrigger implements EvolutionTriggerBase {
  [x: string]: unknown;
}

/**
 * Represents the trigger for an evolution that occurs when a Pokemon levels up.
 * 
 * @class LevelTrigger
 * @extends EvolutionTrigger
 * @property {number|null} level - The level at which the Pokemon evolves, or null if it evolves upon level up regardless of level. 
 * @property {number|null} item_id - The ID of the item that the Pokemon must be holding to evolve, or null if no item is required. 
 * @property {number|null} move_id - The ID of the move that the Pokemon must know to evolve, or null if no move is required. 
 * @property {number|null} move_type_id - The ID of the type of move that the Pokemon must know to evolve, or null if no specific type is required.
 * @property {number|null} time - The time of day when the Pokemon evolves (e.g., "day", "night"), or null if time of day doesn't matter. 
 * @property {number|null} relative_stats - The relative stat requirement for evolution (1 for Attack > Defense, -1 for Defense > Attack, 0 for Attack = Defense), or null if no stat requirement. 
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this evolution trigger.
 */ 
class LevelTrigger extends EvolutionTrigger implements LevelTriggerBase {
    level: number;

    item_id: number;

    move_id: number;

    move_type_id: number;

    time: string;

    relative_stats: number;

    instance: DataManagerBase;

    constructor(
        level: number,
        item_id: number,
        move_id: number,
        move_type_id: number,
        time: string,
        relative_stats: number,
        instance: DataManagerBase
    ) {
        super();
        this.level = level;
        this.item_id = item_id;
        this.move_id = move_id;
        this.move_type_id = move_type_id;
        this.time = time;
        this.relative_stats = relative_stats;
        this.instance = instance;
    }

  [x: string]: unknown;

  get item() {
      if (this.item_id === null) {
          return null;
      }

      return this.instance.items[this.item_id];
  }
  toJSON() {
    const copy = { ...this };
    delete copy.instance
    return copy;
  }
  get move() {
      if (this.move_id === null) {
          return null;
      }

      return this.instance.moves[this.move_id];
  }

  get move_type() {
      if (this.move_type_id === null) {
          return null;
      }

      return constants.TYPES[this.move_type_id];
  }

  get text() {
      let text;
      if (this.level === null) {
          text = 'when leveled up';
      } else {
          text = `starting from level ${this.level}`;
      }

      if (this.item !== null) {
          text += ` while holding a ${this.item}`;
      }

      if (this.move !== null) {
          text += ` while knowing ${this.move}`;
      }

      if (this.move_type !== null) {
          text += ` while knowing a ${this.move_type}-type move`;
      }

      if (this.relative_stats === 1) {
          text += ' when its Attack is higher than its Defense';
      } else if (this.relative_stats === -1) {
          text += ' when its Defense is higher than its Attack';
      } else if (this.relative_stats === 0) {
          text += ' when its Attack is equal to its Defense';
      }

      if (this.time !== null) {
          text += ` in the ${this.time} time`;
      }

      return text;
  }
}

/**
 * Represents the trigger for an evolution that occurs when an item is used on a Pokemon. 
 *
 * @class ItemTrigger 
 * @extends EvolutionTrigger
 * @property {number} item_id - The ID of the item that must be used to trigger the evolution.
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this evolution trigger. 
 */ 
class ItemTrigger extends EvolutionTrigger implements ItemTriggerBase {
    constructor(item_id: number, instance: DataManagerBase) {
        super();
        this.item_id = item_id;
        this.instance = instance;
    }

    item_id: number;

    instance: DataManagerBase;

    get item() {
        return this.instance.items[this.item_id];
    }

    get text() {
        return `using a ${this.item}`;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}

/**
 * Represents the trigger for an evolution that occurs when a Pokemon is traded.
 * 
 * @class TradeTrigger
 * @extends EvolutionTrigger 
 * @property {number|null} item_id - The ID of the item that the Pokemon must be holding to evolve when traded, or null if no item is required.
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this evolution trigger.
 */
class TradeTrigger extends EvolutionTrigger implements TradeTriggerBase {
    constructor(item_id: number | undefined = null, instance: DataManagerBase) {
        super();
        this.item_id = item_id;
        this.instance = instance;
    }

    item_id: number | undefined;

    instance: DataManagerBase;

    get item() {
        if (this.item_id === null) {
            return null;
        }

        return this.instance.items[this.item_id];
    }

    get text() {
        if (this.item_id === null) {
            return 'when traded';
        }

        return `when traded while holding a ${this.item}`;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}
/** 
 * Represents the trigger for an evolution that occurs under other, less common conditions.
 *
 * @class OtherTrigger 
 * @extends EvolutionTrigger
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this evolution trigger. 
 */
class OtherTrigger extends EvolutionTrigger implements OtherTriggerBase {
    instance: DataManagerBase;

    constructor(instance: DataManagerBase) {
        super();
        this.instance = instance;
    }

    get text() {
        return 'somehow';
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
}
/**
 * Represents a pokemon evolution.
 *
 * @class Evolution
 * @property {number} target_id - The ID of the Pokemon species that this evolution evolves to or from. 
 * @property {EvolutionTrigger} trigger - The trigger for this evolution (e.g., level up, trade, item).
 * @property {boolean} type - The direction of the evolution (true for evolving to, false for evolving from).
 * @property {DataManagerBase} instance - The DataManagerBase instance. 
 */
class Evolution implements EvolutionBase {
    constructor(
        target_id: number,
        trigger: EvolutionTrigger,
        type: boolean,
        instance: DataManagerBase
    ) {
        this.target_id = target_id;
        this.trigger = trigger;
        this.type = type;
        this.instance = instance;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
    async evolve_from(
        target: number,
        trigger: EvolutionTrigger,
        instance: DataManagerBase
    ): Promise<Evolution> {
        throw new Error('Method not implemented.');
    }

    async evolve_to(
        target: number,
        trigger: EvolutionTrigger,
        instance: DataManagerBase
    ): Promise<Evolution> {
        throw new Error('Method not implemented.');
    }

    target_id: number;

    trigger: EvolutionTrigger;

    type: boolean;

    instance: DataManagerBase;

    static async evolve_from(
        target: number,
        trigger: EvolutionTrigger,
        instance: DataManagerBase
    ) {
        return new Evolution(target, trigger, false, instance);
    }

    static async evolve_to(
        target: number,
        trigger: EvolutionTrigger,
        instance: DataManagerBase
    ) {
        return new Evolution(target, trigger, true, instance);
    }

    get dir() {
        return this.type ? 'to' : !this.type ? 'from' : 'to';
    }

    get target() {
        return this.instance.pokemon[this.target_id];
    }

    get text() {
        if (this.target[`evolution_${this.dir}`] !== null) {
            const pevo = this.target[`evolution_${this.dir}`];
            return `evolves ${this.dir} ${this.target} ${this.trigger.text}, which ${pevo.text} `;
        }

        return `evolves ${this.dir} ${this.target} ${this.trigger.text}`;
    }
}

/**
 * Represents a list of evolutions.
 *
 * @class EvolutionList 
 * @property {Evolution[]} items - A list of Evolution objects representing the evolutions in the list. 
 */
class EvolutionList implements EvolutionListBase {
    constructor(evolutions: Evolution[]) {
        if (evolutions instanceof Evolution) {
            evolutions = [evolutions];
        }

        this.items = evolutions;
    }

    items: Evolution[];

    get text() {
        let txt: any = this.items.map(e => e.text).join(' and ');
        txt = txt.replace(' and ', ', ');
        return txt;
    }
}

/**
 * Represents the base stats of a Pokemon. 
 * 
 * @class Stats
 * @property {number} hp - The base HP stat.
 * @property {number} atk - The base Attack stat.
 * @property {number} defn - The base Defense stat.
 * @property {number} satk - The base Special Attack stat.
 * @property {number} sdef - The base Special Defense stat. 
 * @property {number} spd - The base Speed stat. 
 */

class Stats implements StatsBase {
  [key: string]: any;

  constructor(
      hp: number,
      atk: number,
      defn: number,
      satk: number,
      sdef: number,
      spd: number
  ) {
      this.hp = hp;
      this.atk = atk;
      this.defn = defn;
      this.satk = satk;
      this.sdef = sdef;
      this.spd = spd;
  }

  hp: number;

  atk: number;

  defn: number;

  satk: number;

  sdef: number;

  spd: number;
}
/**
 * Represents a Pokemon species.
 *
 * @class Species
 * @property {number} id - The ID of the species.
 * @property {string[][]} names - A list of names for the species in different languages. Each sub-array contains a language code and the name in that language.
 * @property {string} slug - The slug for the species (e.g., "pikachu").
 * @property {Stats} base_stats - The base stats for the species.
 * @property {number} height - The height of the species in meters.
 * @property {number} weight - The weight of the species in kilograms. 
 * @property {number} dex_number - The Pokedex number of the species.
 * @property {boolean} catchable - Whether the species can be caught in the wild.
 * @property {string[]} types - A list of types for the species (e.g., ["Electric"]).
 * @property {number} abundance - The abundance of the species in the wild (higher values mean more common).
 * @property {number} gender_rate - The gender rate of the species (-1 for genderless, 0-8 for female ratio).
 * @property {boolean} has_gender_differences - Whether the species has gender differences.
 * @property {string|null} description - The description of the species, or null if none.
 * @property {number|null} mega_id - The ID of the species' Mega Evolution, or null if none.
 * @property {number|null} mega_x_id - The ID of the species' Mega X Evolution, or null if none.
 * @property {number|null} mega_y_id - The ID of the species' Mega Y Evolution, or null if none.
 * @property {EvolutionList|null} evolution_from - The EvolutionList representing how this species evolves from others, or null if none.
 * @property {EvolutionList|null} evolution_to - The EvolutionList representing how this species evolves into others, or null if none.
 * @property {boolean} mythical - Whether the species is a Mythical Pokemon.
 * @property {boolean} legendary - Whether the species is a Legendary Pokemon.
 * @property {boolean} ultra_beast - Whether the species is an Ultra Beast.
 * @property {boolean} event - Whether the species is an event-exclusive Pokemon.
 * @property {boolean} is_form - Whether the species is a form of another Pokemon.
 * @property {number|null} form_item - The ID of the item used to change into this form, or null if none.
 * @property {string} region - The region where the species was introduced. 
 * @property {string|null} art_credit - The artist who created the artwork for the species, or null if unknown. 
 * @property {DataManagerBase} instance - The DataManagerBase instance associated with this species.
 * @property {PokemonMove[]} moves - A list of PokemonMove objects representing the moves that the species can learn.
 */

class Species implements SpeciesBase {
    constructor(
        id: number,
        names: string[][],
        slug: string,
        base_stats: Stats,
        height: number,
        weight: number,
        dex_number: number,
        catchable: boolean,
        types: string[],
        abundance: number,
        gender_rate: number,
        has_gender_differences: boolean,
        description: string | undefined = null,
        mega_id: number | undefined = null,
        mega_x_id: number | undefined = null,
        mega_y_id: number | undefined = null,
        evolution_from: EvolutionList | undefined = null,
        evolution_to: EvolutionList | undefined = null,
        mythical = false,
        legendary = false,
        ultra_beast = false,
        event = false,
        is_form = false,
        form_item: number | undefined = null,
        region: string,
        art_credit: string | undefined = null,
        instance: DataManagerBase,
        moves: PokemonMove[] | [] = []
    ) {
        this.id = id;
        this.names = names;
        this.slug = slug;
        this.base_stats = base_stats;
        this.height = height;
        this.weight = weight;
        this.dex_number = dex_number;
        this.catchable = catchable;
        this.types = types;
        this.abundance = abundance;
        this.gender_rate = gender_rate;
        this.has_gender_differences = has_gender_differences;
        this.description = description;
        this.mega_id = mega_id;
        this.mega_x_id = mega_x_id;
        this.mega_y_id = mega_y_id;
        this.evolution_from = evolution_from;
        this.evolution_to = evolution_to;
        this.mythical = mythical;
        this.legendary = legendary;
        this.ultra_beast = ultra_beast;
        this.event = event;
        this.is_form = is_form;
        this.form_item = form_item;
        this.region = region;
        this.art_credit = art_credit;
        this.instance = instance;
        this.moves = moves;
    }

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

    moves: PokemonMove[];

    get name() {
        const found = this.names.find(x => (x[0] ? x[0] === '🇬🇧' : null));
        if (found == null) {
            return null;
        }

        return found[1];
    }

    toString() {
        return this.name;
    }
    toJSON() {
      const copy = { ...this };
      delete copy.instance
      return copy;
    }
    get moveset() {
        return this.moves.map(x => this.instance.moves[x.move_id]);
    }

    get mega(): Species | undefined {
        if (this.mega_id === null) {
            return null;
        }

        return this.instance.pokemon[this.mega_id];
    }

    get mega_x(): Species | undefined {
        if (this.mega_x_id === null) {
            return null;
        }

        return this.instance.pokemon[this.mega_x_id];
    }

    get mega_y(): Species | undefined {
        if (this.mega_y_id === null) {
            return null;
        }

        return this.instance.pokemon[this.mega_y_id];
    }

    get correct_guesses() {
        return [this.names.map(x => deaccent(x[1].toLowerCase())), this.slug];
    }

    get trade_evolutions() {
        if (this.evolution_to === null) {
            return [];
        }

        const evos = [];
        for (const e of this.evolution_to.items) {
            if (e.trigger instanceof TradeTrigger) {
                evos.push(e);
            }
        }

        return evos;
    }

    get evolution_text() {
        if (this.is_form && this.form_item !== null) {
            const species = this.instance.pokemon[this.dex_number];
            const item = this.instance.items[this.form_item];
            return `${this.name} transforms from ${species} when given a ${item.name}.`;
        }

        if (this.evolution_from !== null && this.evolution_to !== null) {
            return `${this.name} ${this.evolution_from.text} and ${this.evolution_to.text}.`;
        }
        if (this.evolution_from !== null) {
            return `${this.name} ${this.evolution_from.text}.`;
        }
        if (this.evolution_to !== null) {
            return `${this.name} ${this.evolution_to.text}.`;
        }
        return null;
    }
}
/**
 * Represents a Pokedex.
 *
 * @class DataManagerBase
 */
class DataManagerBase implements DataManagerBaseType {
  
    /**
     * Checks if the DataManager has been initialized.
     * @throws {Error} If the DataManager is not initialized.
     */
    checkinitialized(): void {
        throw new Error('Method not implemented.');
    }
    /**
     * A dictionary of Pokemon species, indexed by ID.
     * @type {Object.<number, Species>}
     */
    pokemon!: {
    [key: number]: Species;
  };
    /**
     * A dictionary of items, indexed by ID.
     * @type {Object.<number, Item>}
     */
    items!: {
    [key: number]: Item;
  };
    /**
     * A dictionary of move effects, indexed by ID.
     * @type {Object.<number, MoveEffect>}
     */
    effects!: {
    [key: number]: MoveEffect;
  };
    /**
     * A dictionary of moves, indexed by ID.
     * @type {Object.<number, Move>}
     */
    moves!: {
    [key: number]: Move;
  };
  toJSON(){
    return { 
      pokemonCount: Object.keys(this.pokemon).length,
      itemCount: Object.keys(this.items).length,
      effectCount: Object.keys(this.effects).length,
      moveCount: Object.keys(this.moves).length,
    };
  }
    /**
     * Gets a list of all Pokemon species.
     * @returns {Species[]} A list of all Pokemon species. 
     */
    allPokemon() {
        this.checkinitialized();
        return Object.values(this.pokemon);
    }
    /**
     * Gets a list of Alolan Pokemon species IDs.
     * @type {number[]}
     */
    get list_alolan() {
        return [
            10091, 10092, 10093, 10100, 10101, 10102, 10103, 10104, 10105, 10106,
            10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 50076,
        ];
    }
    /**
     * Gets a list of Galarian Pokemon species IDs.
     * @type {number[]} 
     */
    get list_galarian() {
        return [
            10158, 10159, 10160, 10161, 10162, 10163, 10164, 10165, 10166, 10167,
            10168, 10169, 10170, 10171, 10172, 10173, 10174, 10175, 10176, 10177,
            50053,
        ];
    }
    /**
     * Gets a list of Hisuian Pokemon species IDs.
     * @type {number[]} 
     */
    get list_hisuian() {
        return [
            10221, 10222, 10223, 10224, 10225, 10226, 10227, 10228, 10229, 10230,
            10231, 10232, 10233, 10234, 10235, 10236, 10237, 10238, 10239, 50145,
        ];
    }
    /**
     * Gets a list of Paradox Pokemon species IDs.
     * @type {number[]} 
     */
    get list_paradox() {
        return [
            984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006,
            1007, 1008, 1009, 1010,
        ];
    }
    /**
     * Gets a list of Mythical Pokemon species IDs. 
     * @type {number[]} 
     */

    get list_mythical() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.mythical)
            .map(v => v.id);
    }
    /** 
     * Gets a list of Legendary Pokemon species IDs.
     * @type {number[]} 
     */
    get list_legendary() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.legendary)
            .map(v => v.id);
    }
    /** 
     * Gets a list of Ultra Beast Pokemon species IDs.
     * @type {number[]} 
     */
    get list_ub() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.ultra_beast)
            .map(v => v.id);
    }
    /** 
     * Gets a list of Event Pokemon species IDs.
     * @type {number[]} 
     */
    get list_event() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.event)
            .map(v => v.id);
    }
    /** 
     * Gets a list of Mega Evolution Pokemon species IDs.
     * @type {number[]} 
     */
    get list_mega() {
        this.checkinitialized();
        return [
            ...Object.values(this.pokemon)
                .filter(v => v.mega_id !== null)
                .map(v => v.mega_id),
            ...Object.values(this.pokemon)
                .filter(v => v.mega_x_id !== null)
                .map(v => v.mega_x_id),
            ...Object.values(this.pokemon)
                .filter(v => v.mega_y_id !== null)
                .map(v => v.mega_y_id),
        ];
    }
    /** 
     * Gets a dictionary of species IDs indexed by Pokemon type.
     * @type {Record<string, number[]>}
     */
    get species_id_by_type_index() {
        this.checkinitialized();
        const ret: Record<string, number[]> = {};
        for (const pokemon of Object.values(this.pokemon)) {
            for (const typ of pokemon.types) {
                if (!ret[typ]) {
                    ret[typ] = [];
                }

                ret[typ].push(pokemon.id);
            }
        }

        return ret;
    }
    /** 
     * Gets a Map of species IDs indexed by Pokemon region.
     * @type {Map<string, number[]>} 
     */
    get speciesIdByRegionIndex() {
        this.checkinitialized();
        const ret: Map<string,number[]> = new Map();
        for (const pokemon of Object.values(this.pokemon)) {
            const region = pokemon.region.toLowerCase();
            if (!ret.has(region)) {
                ret.set(region, []);
            }

            ret.get(region).push(pokemon.id);
        }

        return ret;
    }

    /** 
     * Gets a list of Pokemon species IDs for a given region.
     * @param {string} region - The name of the region.
     * @returns {number[]} A list of Pokemon species IDs. 
     */
    listRegion(region: string) {
        this.checkinitialized();
        return this.speciesIdByRegionIndex.get(region.toLowerCase()) || [];
    }
    /** 
     * Gets a Map of species IDs indexed by move ID.
     * @type {Map<number, number[]>} 
     */
    get speciesIdByMoveIndex() {
        this.checkinitialized();
        const ret: Map<number,number[]> = new Map();
        for (const pokemon of this.allPokemon()) {
            for (const pmove of pokemon.moves) {
                if (!ret.has(pmove.move_id)) {
                    ret.set(pmove.move_id, []);
                }

                const ls = ret.get(pmove.move_id);
                if (!ls.includes(pokemon.id)) {
                    ls.push(pokemon.id);
                }
            }
        }

        return ret;
    }
    /** 
     * Gets a list of Pokemon species IDs that can learn a given move.
     * @param {string} moveName - The name of the move.
     * @returns {number[]} A list of Pokemon species IDs. 
     */
    listMove(moveName: string) {
        this.checkinitialized();
        if (!moveName) {
            return this.allPokemon()
                .filter(s => s.moves)
                .map(s => s.id);
        }

        const move = this.moveByName(moveName);
        if (!move) {
            return [];
        }

        return this.speciesIdByMoveIndex.get(move.id) || [];
    }
    /**
     * Gets a list of all items.
     * @returns {Item[]} A list of all items. 
     */
    allItems() {
        this.checkinitialized();
        return Object.values(this.items);
    }
    /**
     * Gets a Map of species indexed by their dex number.
     * @type {Map<number, Species[]>} 
     */ 
    get speciesByDexNumberIndex() {
        this.checkinitialized();
        const ret: Map<number,Species[]> = new Map();
        for (const pokemon of Object.values(this.pokemon)) {
            if (!ret.has(pokemon.id)) {
                ret.set(pokemon.id, []);
            }

            ret.get(pokemon.id).push(pokemon);
            if (pokemon.id !== pokemon.dex_number) {
                if (!ret.has(pokemon.dex_number)) {
                    ret.set(pokemon.dex_number, []);
                }

                ret.get(pokemon.dex_number).push(pokemon);
            }
        }

        return ret;
    }
    /** 
     * Gets a list of all species with the given dex number.
     * @param {number} number - The dex number.
     * @returns {Species[]} A list of Pokemon species. 
     */
    allSpeciesByNumber(number: number) {
        this.checkinitialized();
        return this.speciesByDexNumberIndex.get(number) || [];
    }
    /** 
    * Gets a list of all species with the given name.
    * @param {string} name - The name of the Pokemon species.
    * @returns {Species[]} A list of Pokemon species. 
    */
    allSpeciesByName(name: string): Species[] {
        this.checkinitialized();
        const st = deaccent(name.toLowerCase().replace('′', '\''));
        return this.speciesByNameIndex.get(st) || [];
    }
    /** 
     * Finds a species by its dex number. 
     * @param {number} number - The dex number.
     * @returns {Species|null} The Pokemon species with the given dex number, or null if not found. 
     */ 
    findSpeciesByNumber(number: number) {
        this.checkinitialized();
        return this.pokemon[number] || null;
    }
    /**
     * Gets a Map of species indexed by their name.
     * @type {Map<string, Species[]>} 
     */ 
    get speciesByNameIndex() {
        this.checkinitialized();
        const ret: Map<string,Species[]>  = new Map();
        for (const pokemon of Object.values(this.pokemon)) {
            const guess = pokemon.correct_guesses;
            for (let name of guess) {
                if(typeof name != 'string') name = name[0];
                if (!ret.has(name)) {
                    ret.set(name, []);
                }

                ret.get(name).push(pokemon);
            }
        }

        return ret;
    }
    /**
     * Finds a species by its name.
     * @param {string} name - The name of the Pokemon species.
     * @returns {Species|null} The Pokemon species with the given name, or null if not found. 
     */ 
    speciesByName(name: string) {
        this.checkinitialized();
        const st = deaccent(name.toLowerCase().replace('′', '\''));
        const speciesList = this.speciesByNameIndex.get(st);
        return speciesList ? speciesList[0] : null;
    }
    /** 
     * Finds an item by its ID.
     * @param {number} number - The ID of the item.
     * @returns {Item|null} The item with the given ID, or null if not found. 
     */
    itemByNumber(number: number) {
        this.checkinitialized();
        return this.items[number] || null;
    }
    /** 
     * Gets a Map of items indexed by their name.
     * @type {Map<string, Item>} 
     */
    get itemByNameIndex() {
        this.checkinitialized();
        const ret: Map<string,Item> = new Map();
        for (const item of Object.values(this.items)) {
            ret.set(item.name.toLowerCase(), item);
        }

        return ret;
    }
    /** 
     * Finds an item by its name.
     * @param {string} name - The name of the item. 
     * @returns {Item|null} The item with the given name, or null if not found. 
     */
    itemByName(name: string) {
        this.checkinitialized();
        return this.itemByNameIndex.get(
            deaccent(name.toLowerCase().replace('′', '\''))
        );
    }
    /** 
     * Finds a move by its ID. 
     * @param {number} number - The ID of the move. 
     * @returns {Move|null} The move with the given ID, or null if not found. 
     */
    moveByNumber(number: number) {
        this.checkinitialized();
        return this.moves[number] || null;
    }
    /** 
     * Gets a Map of moves indexed by their name.
     * @type {Map<string, Move>}
     */
    get moveByNameIndex() {
        this.checkinitialized();
        const ret: Map<string,Move> = new Map();
        for (const move of Object.values(this.moves)) {
            ret.set(move.name.toLowerCase(), move);
        }

        return ret;
    }
    /** 
     * Finds a move by its name. 
     * @param {string} name - The name of the move. 
     * @returns {Move|null} The move with the given name, or null if not found. 
     */
    moveByName(name: string) {
        this.checkinitialized();
        return this.moveByNameIndex.get(
            deaccent(name.toLowerCase().replace('′', '’'))
        );
    }
    /**
 * Returns a random Pokemon species.
 *
 * @param {string} [rarity='normal'] - The rarity of the Pokemon to spawn. Can be 'normal', 'mythical', 'legendary', or 'ultra_beast'.
 * @returns {Species} A random Pokemon species.
 */
    randomSpawn(rarity = 'normal') {
        this.checkinitialized();
        let pool;
        if (rarity === 'mythical') {
            pool = this.allPokemon().filter(x => x.catchable && x.mythical);
        } else if (rarity === 'legendary') {
            pool = this.allPokemon().filter(x => x.catchable && x.legendary);
        } else if (rarity === 'ultra_beast') {
            pool = this.allPokemon().filter(x => x.catchable && x.ultra_beast);
        } else {
            pool = this.allPokemon().filter(x => x.catchable);
        }

        const weights = pool.map(x => x.abundance);
        const randomIndex = this.weightedRandomChoice(weights);
        return pool[randomIndex];
    }

    /**
     * Returns a random Pokemon.
     *
     * @param {string} [rarity='normal'] - The rarity of the Pokemon to spawn. Can be 'normal', 'mythical', 'legendary', or 'ultra_beast'.
     * @returns {PokemonBase} A random Pokemon instance.
     */
    randomSpawnPokemon(rarity = 'normal'){
        this.checkinitialized();
        const spawned = this.randomSpawn(rarity)
        return new PokemonBase(spawned,this)
    }

    /** 
     * Chooses a random element from a list of weights using weighted random selection. 
     * @param {number[]} weights - A list of weights. 
     * @returns {number} The index of the chosen element. 
     */
    weightedRandomChoice(weights: number[]) {
        this.checkinitialized();
        const total = weights.reduce((acc, w) => acc + w, 0);
        let threshold = Math.random() * total;
        for (let i = 0; i < weights.length; i++) {
            if (weights[i] >= threshold) {
                return i;
            }

            threshold -= weights[i];
        }

        return 0;
    }

    get spawnWeights() {
        this.checkinitialized();
        return Object.values(this.pokemon).map(p => p.abundance);
    }
}

export {
    DataManagerBase,
    MoveMeta,
    MoveResult,
    MoveMethod,
    Move,
    ItemTrigger,
    LevelTrigger,
    LevelMethod,
    PokemonMove,
    Species,
    StatStages,
    Stats,
    StatChange,
    OtherTrigger,
    TradeTrigger,
    Item,
    MoveEffect,
    type MoveBase,
    Evolution,
    EvolutionTrigger,
    EvolutionList,
};
