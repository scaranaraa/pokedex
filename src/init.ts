import ARTISTS from './constants.js';
import { get_data_from } from './utils.js';
import {
  LevelTrigger,
  OtherTrigger,
  TradeTrigger,
  ItemTrigger,
  Stats,
  MoveMeta,
  DataManagerBase,
  Item,
  Species,
  MoveEffect,
  StatChange,
  MoveBase,
  Move,
  LevelMethod,
  PokemonMove,
  Evolution,
  EvolutionList,
} from './models.js';
import type {
  IItem,
  IMove,
  IMoveMeta,
  IMoveNames,
  IPokemonMove,
  MoveEffectProse,
  MoveMetaStatChanges,
  Pokemon,
} from '../types.js';

async function get_pokemon(instance: DataManager) {
  const specie = await get_data_from<Pokemon>('pokemon.csv');
  const species = specie.reduce((acc: { [key: string]: Pokemon }, x) => {
    acc[x.id] = x;
    return acc;
  }, {});
  const evolutions = await get_data_from<any>('evolution.csv');
  // console.log(evolutions)
  const evolution = evolutions.reverse().reduce((acc, x) => {
    acc[x.evolved_species_id] = x;
    return acc;
  }, {});
  async function get_evolution_trigger(pid: string) {
    const evo = evolution[String(pid)];
    if (!evo) {
      return;
    }

    if (evo.evolution_trigger_id === 1) {
      const level = evo.minimum_level || null;
      let item = evo.held_item_id || null;
      const move = evo.known_move_id || null;
      const movetype = evo.known_move_type_id || null;
      const time = evo.time_of_day || null;
      const relative_stats = evo.relative_physical_stats || null;
      if (evo.location_id) {
        return new OtherTrigger(instance);
      }

      if (evo.minimum_happiness) {
        item = 14001;
      }

      return new LevelTrigger(
        level,
        item,
        move,
        movetype,
        time,
        relative_stats,
        instance
      );
    }
    if (evo.evolution_trigger_id == 2) {
      if (evo.held_item_id) {
        return new TradeTrigger(evo.held_item_id, instance);
      }

      return new TradeTrigger(undefined, instance);
    }
    if (evo.evolution_trigger_id == 3) {
      if (evo.trigger_item_id) {
        return new ItemTrigger(evo.trigger_item_id, instance);
      }

      return new OtherTrigger(instance);
    }

    return new OtherTrigger(instance);
  }

  const pokemon: { [key: string]: Species } = {};
  for (const row of Object.values(species)) {
    if (!('enabled' in row)) {
      continue;
    }

    let evo_from = null;
    let evo_to = null;
    if (row['evo.from']) {
      const res = await get_evolution_trigger(row.id);
      evo_from = await Evolution.evolve_from(
        parseInt(row['evo.from']),
        res,
        instance
      );
    }

    if (row['evo.to']) {
      evo_to = [];
      for (const s of String(row['evo.to']).split(' ')) {
        if (!s) {
          continue;
        }

        const pto = species[parseInt(s)];
        const res = await get_evolution_trigger(pto.id);
        evo_to.push(await Evolution.evolve_to(parseInt(s), res, instance));
      }
    }

    if (evo_to && evo_to.length === 0) {
      evo_to = null;
    }

    const types = [];
    if ('type.0' in row) {
      types.push(row['type.0']);
    }

    if ('type.1' in row) {
      types.push(row['type.1']);
    }

    const names = [];
    if ('name.ja' in row) {
      names.push(['🇯🇵', row['name.ja']]);
    }

    if ('name.ja_r' in row) {
      names.push(['🇯🇵', row['name.ja_r']]);
    }

    if ('name.en' in row) {
      names.push(['🇬🇧', row['name.en']]);
    }

    if ('name.en2' in row) {
      names.push(['🇬🇧', row['name.en2']]);
    }

    if ('name.de' in row) {
      names.push(['🇩🇪', row['name.de']]);
    }

    if ('name.fr' in row) {
      names.push(['🇫🇷', row['name.fr']]);
    }

    let art_credit = row.credit;
    if (art_credit) {
      art_credit = '';
    }

    pokemon[row.id] = new Species(
      parseInt(row.id),
      names,
      row.slug,
      new Stats(
        parseInt(row['base.hp']),
        parseInt(row['base.atk']),
        parseInt(row['base.def']),
        parseInt(row['base.satk']),
        parseInt(row['base.sdef']),
        parseInt(row['base.spd'])
      ),
      parseInt(row.height) / 10,
      parseInt(row.weight) / 10,
      parseInt(row.dex_number),
      !!row.catchable,
      types,
      parseInt(row.abundance) || 0,
      parseInt(row.gender_rate) || -1,
      !!row.has_gender_differences,
      row.description || null,
      parseInt(row['evo.mega']) || null,
      parseInt(row['evo.mega_x']) || null,
      parseInt(row['evo.mega_y']) || null,
      /* new Species(:mega_id?: null, mega_x_id?: null, mega_y_id?: null, evolution_from?: null, evolution_to?: null, mythical?: boolean, legendary?: boolean, ultra_beast?: boolean, event?: boolean, is_form?: boolean, form_item?: null, moves?: null, region?: null, art_credit?: null, instance?: UnregisteredDataManager): Species */
      evo_from ? new EvolutionList([evo_from]) : null,
      evo_to ? new EvolutionList(evo_to) : null,
      !!row.mythical,
      !!row.legendary,
      !!row.ultra_beast,
      !!row.event,
      !!row.is_form,
      parseInt(row.form_item) || null,
      row.region,
      art_credit,
      instance,
      []
    );
  }

  const moves = await get_data_from<IPokemonMove>('pokemon_moves.csv');
  const version_group: { [key: number]: any } = {};
  for (const row of moves) {
    version_group[row.pokemon_id] = Math.max(
      version_group[row.pokemon_id] || 0,
      row.version_group_id
    );
  }

  for (const row of moves) {
    if (
      row.pokemon_move_method_id === 1 &&
      row.pokemon_id in pokemon &&
      row.version_group_id === version_group[row.pokemon_id]
    ) {
      if (!(row.move_id in instance.moves)) {
        continue;
      }

      pokemon[row.pokemon_id].moves.push(
        new PokemonMove(
          row.move_id,
          new LevelMethod(row.level, instance),
          instance
        )
      );
    }
  }

  for (const p of Object.values(pokemon)) {
    // @ts-ignore
    p.moves.sort((a, b) => a.method.level - b.method.level);
  }

  return pokemon;
}

async function get_items(instance: DataManager) {
  const data = await get_data_from<IItem>('items.csv');
  const items: { [key: number]: Item } = {};
  for (const row of data) {
    items[row.id] = new Item(
      row.id,
      row.name,
      row.description || null,
      row.cost,
      row.page,
      row.action,
      !row.seperate,
      row.emote || null,
      !!row.shard,
      instance
    );
  }

  return items;
}

async function get_effects(instance: DataManager) {
  const data = await get_data_from<MoveEffectProse>('move_effect_prose.csv');
  const effects: { [key: number]: MoveEffect } = {};
  for (const row of data) {
    let description = row.short_effect.replace(
      ARTISTS.DESCRIPTION_LINK_REGEX,
      '$1'
    );
    description = description.replace('$effect_chance', '{effect_chance}');
    effects[row.move_effect_id] = new MoveEffect(
      row.move_effect_id,
      description,
      instance
    );
  }

  return effects;
}

async function get_moves(instance: DataManager) {
  const data = await get_data_from<IMove>('moves.csv');
  const name = await get_data_from<IMoveNames>('move_names.csv');
  const names = name
    .filter(x => x.local_language_id === 9)
    .reduce((acc: { [key: number]: any }, x) => {
      acc[x.move_id] = x.name;
      return acc;
    }, {});
  const metas = await get_data_from<IMoveMeta>('move_meta.csv');
  const meta = metas.reduce((acc: { [key: number]: any }, x) => {
    acc[x.move_id] = x;
    return acc;
  }, {});
  const meta_stat = await get_data_from<MoveMetaStatChanges>(
    'move_meta_stat_changes.csv'
  );
  const meta_stats = meta_stat.reduce((acc: { [key: number]: any }, x) => {
    const moveId = x.move_id;

    if (!acc[moveId]) {
      acc[moveId] = [];
    }

    acc[moveId].push(x);
    delete x.move_id;

    return acc;
  }, {});
  const moves: { [key: number]: Move } = {};
  for (const row of data) {
    if (row.id > 10000) {
      continue;
    }

    const mmeta = meta[row.id];
    if (!mmeta) {
      continue;
    }

    delete mmeta.move_id;
    const statchanges = meta_stats[row.id]
      ? meta_stats[row.id].map((x: any) => new StatChange(x.stat_id, x.change))
      : [];
    const { effect_id } = row;
    let accuracy = row.accuracy || null;
    if (
      instance.effects[effect_id]?.description
        ?.toLowerCase()
        .includes('never misses')
    ) {
      accuracy = 100;
    }

    moves[row.id] = new Move(
      row.id,
      row.identifier,
      names[row.id],
      row.power || null,
      row.pp,
      accuracy,
      row.priority,
      row.target_id,
      row.type_id,
      row.damage_class_id,
      effect_id,
      row.effect_chance || null,
      new MoveMeta(
        mmeta.meta_category_id,
        mmeta.meta_ailment_id,
        mmeta.drain,
        mmeta.healing,
        mmeta.crit_rate,
        mmeta.ailment_chance,
        mmeta.flinch_chance,
        mmeta.stat_chance,
        mmeta.min_hits,
        mmeta.max_hits,
        mmeta.min_turns,
        mmeta.max_turns,
        statchanges
      ),
      instance
    );
  }

  return moves;
}

class DataManager extends DataManagerBase {

  async init() {
    this.effects = await get_effects(this);
    this.moves = await get_moves(this);
    this.pokemon = await get_pokemon(this);
    this.items = await get_items(this);
  }
}

export default DataManager;
