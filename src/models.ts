/**
 * @module
 */
import constants from './constants.js';
import { type PokemonBase } from './pokemonbase.js';
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
}

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
        if (typ_mult === 0) {
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
}

class MoveMethod implements MoveMethodBase {}

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
}

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
}

class EvolutionTrigger implements EvolutionTriggerBase {
  [x: string]: unknown;
}

class LevelTrigger extends EvolutionTrigger implements LevelTriggerBase {
    level: number;

    item_id: number;

    move_id: number;

    move_type_id: number;

    time: number;

    relative_stats: number;

    instance: DataManagerBase;

    constructor(
        level: number,
        item_id: number,
        move_id: number,
        move_type_id: number,
        time: number,
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
          text += ` in the ${this.time}time`;
      }

      return text;
  }
}

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
}

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
}

class OtherTrigger extends EvolutionTrigger implements OtherTriggerBase {
    instance: DataManagerBase;

    constructor(instance: DataManagerBase) {
        super();
        this.instance = instance;
    }

    get text() {
        return 'somehow';
    }
}

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

class DataManagerBase implements DataManagerBaseType {
    checkinitialized(): void {
        throw new Error('Method not implemented.');
    }
    pokemon!: {
    [key: number]: Species;
  };

    items!: {
    [key: number]: Item;
  };

    effects!: {
    [key: number]: MoveEffect;
  };

    moves!: {
    [key: number]: Move;
  };

    allPokemon() {
        this.checkinitialized();
        return Object.values(this.pokemon);
    }

    get list_alolan() {
        return [
            10091, 10092, 10093, 10100, 10101, 10102, 10103, 10104, 10105, 10106,
            10107, 10108, 10109, 10110, 10111, 10112, 10113, 10114, 10115, 50076,
        ];
    }

    get list_galarian() {
        return [
            10158, 10159, 10160, 10161, 10162, 10163, 10164, 10165, 10166, 10167,
            10168, 10169, 10170, 10171, 10172, 10173, 10174, 10175, 10176, 10177,
            50053,
        ];
    }

    get list_hisuian() {
        return [
            10221, 10222, 10223, 10224, 10225, 10226, 10227, 10228, 10229, 10230,
            10231, 10232, 10233, 10234, 10235, 10236, 10237, 10238, 10239, 50145,
        ];
    }

    get list_paradox() {
        return [
            984, 985, 986, 987, 988, 989, 990, 991, 992, 993, 994, 995, 1005, 1006,
            1007, 1008, 1009, 1010,
        ];
    }

    get list_mythical() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.mythical)
            .map(v => v.id);
    }

    get list_legendary() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.legendary)
            .map(v => v.id);
    }

    get list_ub() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.ultra_beast)
            .map(v => v.id);
    }

    get list_event() {
        this.checkinitialized();
        return Object.values(this.pokemon)
            .filter(v => v.event)
            .map(v => v.id);
    }

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

    listRegion(region: string) {
        this.checkinitialized();
        return this.speciesIdByRegionIndex.get(region.toLowerCase()) || [];
    }

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

    allItems() {
        this.checkinitialized();
        return Object.values(this.items);
    }

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

    allSpeciesByNumber(number: number) {
        this.checkinitialized();
        return this.speciesByDexNumberIndex.get(number) || [];
    }

    allSpeciesByName(name: string): Species[] {
        this.checkinitialized();
        const st = deaccent(name.toLowerCase().replace('′', '\''));
        return this.speciesByNameIndex.get(st) || [];
    }

    findSpeciesByNumber(number: number) {
        this.checkinitialized();
        return this.pokemon[number] || null;
    }

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

    speciesByName(name: string) {
        this.checkinitialized();
        const st = deaccent(name.toLowerCase().replace('′', '\''));
        const speciesList = this.speciesByNameIndex.get(st);
        return speciesList ? speciesList[0] : null;
    }

    itemByNumber(number: number) {
        this.checkinitialized();
        return this.items[number] || null;
    }

    get itemByNameIndex() {
        this.checkinitialized();
        const ret: Map<string,Item> = new Map();
        for (const item of Object.values(this.items)) {
            ret.set(item.name.toLowerCase(), item);
        }

        return ret;
    }

    itemByName(name: string) {
        this.checkinitialized();
        return this.itemByNameIndex.get(
            deaccent(name.toLowerCase().replace('′', '\''))
        );
    }

    moveByNumber(number: number) {
        this.checkinitialized();
        return this.moves[number] || null;
    }

    get moveByNameIndex() {
        this.checkinitialized();
        const ret: Map<string,Move> = new Map();
        for (const move of Object.values(this.moves)) {
            ret.set(move.name.toLowerCase(), move);
        }

        return ret;
    }

    moveByName(name: string) {
        this.checkinitialized();
        return this.moveByNameIndex.get(
            deaccent(name.toLowerCase().replace('′', '’'))
        );
    }

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
