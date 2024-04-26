import { Pokedex, Pokemon } from './dist/index.js';

const pokedex = new Pokedex();
await pokedex.init(); // Initialize the Pokedex


// Get information about a specific Pokemon
const charizard = pokedex.speciesByName('Charizard');
console.log(charizard.toJSON()); 
/* Output: 
{
  id: 6,
  names: [ ... ],
  slug: 'charizard',
  base_stats: { hp: 78, atk: 84, defn: 78, satk: 109, sdef: 85, spd: 100 },
  height: 1.7,
  weight: 90.5,
  dex_number: 6,
  catchable: true,
  types: [ 'Fire', 'Flying' ],
  // ... other properties
}
*/


// Get evolution information
console.log(charizard.evolution_text);
// Output: Charizard evolves from Charmeleon starting from level 36, which evolves from Charmander starting from level 16.

// Access specific properties
console.log(charizard.name);      // Output: Charizard
console.log(charizard.base_stats);  // Output: Stats { hp: 78, atk: 84, ... }
console.log(charizard.types);      // Output: [ 'Fire', 'Flying' ]

// Get moveset (list of Move objects)
console.log(charizard.moveset);

// Check for Mega Evolutions
console.log(charizard.mega_x);     // Output: Species { ... } (Mega Charizard X)
console.log(charizard.mega_y);     // Output: Species { ... } (Mega Charizard Y)

// Get trade evolutions
console.log(charizard.trade_evolutions);  // Output: [] (Charizard has no trade evolutions)


// --- Move Examples ---
const dragonPulse = pokedex.moveByName('Dragon Pulse');
console.log(dragonPulse.toJSON()); 
/* Output:
{
  id: 406,
  slug: 'dragon-pulse',
  name: 'Dragon Pulse',
  power: 85,
  pp: 10,
  accuracy: 100,
  priority: 0,
  target_id: 9,
  type_id: 16,
  damage_class_id: 3,
  effect_id: 1,
  effect_chance: null,
  meta: { ... }
} 
*/

// Get the description of the move's effect
console.log(dragonPulse.description);

// --- PokemonBase Examples ---

// Create a Pokemon instance from a random spawn
const randomPokemon = pokedex.randomSpawn();
const myPokemon = new Pokemon(randomPokemon, pokedex); 
console.log(myPokemon.toJSON()); 

// Access properties and calculated stats
console.log(myPokemon.species.name);  // Output: (Pokemon species name)
console.log(myPokemon.level);       // Output: (Pokemon's level)
console.log(myPokemon.atk);         // Output: (Calculated Attack stat)
console.log(myPokemon.defn);        // Output: (Calculated Defense stat)

// Get next evolution (if any)
console.log(myPokemon.getNextEvolution());

// Check if the Pokemon can evolve
console.log(myPokemon.canEvolve());

// Simulate a battle turn
const opponentPokemon = new Pokemon(pokedex.randomSpawn(), pokedex);
const attackResult = myPokemon.moves[0].move.calculate_turn(myPokemon, opponentPokemon); 
console.log(attackResult);
/* Output: 
MoveResult {
  success: true,
  damage: (calculated damage),
  healing: (calculated healing),
  ailment: (inflicted ailment or null), 
  messages: [ ... ], 
  stat_changes: [ ... ] 
}
*/ 

// --- Pokedex Examples ---

// Get all Pokemon species
const allPokemon = pokedex.allPokemon();
console.log(allPokemon.length);  // Output: (Number of Pokemon species)

// Get Pokemon by region
const kantoPokemon = pokedex.listRegion('Kanto');
console.log(kantoPokemon.length);  // Output: (Number of Kanto Pokemon)

// Get Pokemon that can learn a specific move
const pokemonWithThunderbolt = pokedex.listMove('Thunderbolt');
console.log(pokemonWithThunderbolt); // Output: (List of Pokemon IDs) 

// Get Pokemon by type
const firePokemon = pokedex.species_id_by_type_index['Fire'];
console.log(firePokemon); // Output: (List of Fire Pokemon IDs)

// --- Other Functions ---

// Access lists of specific Pokemon categories
console.log(pokedex.list_alolan);    // Output: (List of Alolan Pokemon IDs)
console.log(pokedex.list_galarian);  // Output: (List of Galarian Pokemon IDs)
console.log(pokedex.list_mythical);  // Output: (List of Mythical Pokemon IDs)
// ... (and so on for other lists)

// Get a random Pokemon spawn with specific rarity
const legendarySpawn = pokedex.randomSpawn('legendary');
console.log(legendarySpawn.name);

// Get all items
const allItems = pokedex.allItems();
console.log(allItems);  // Output: (List of Item objects)

// Get an item by name
const potion = pokedex.itemByName('Rare Candy');
console.log(potion);  // Output: Item { ... }

// Get a move by ID
const moveById = pokedex.moveByNumber(1);
console.log(moveById); // Output: Move { ... } (if found)


// --- Evolution Examples --- 

// Access evolution properties
if (charmander.evolution_to) {
  const evolutionToCharmeleon = charmander.evolution_to.items[0];
  console.log(evolutionToCharmeleon.target.name);    // Output: Charmeleon
  console.log(evolutionToCharmeleon.trigger.text); // Output: starting from level 16
}

// --- StatChange Examples ---

// Access properties of a StatChange object 
console.log(statChange.stat_id);  // Output: (ID of the affected stat)
console.log(statChange.change);  // Output: (Amount of change)
console.log(statChange.stat);    // Output: (Name of the affected stat)

// --- StatStages Examples ---

// Create a StatStages object with initial values
const stages = new StatStages(1, 2, -1, 0, 0, 0);

// Update the stages
stages.update({ atk: 1, defn: -1 });
console.log(stages.atk);  // Output: 3
console.log(stages.defn); // Output: -2

// --- OtherTrigger, TradeTrigger, ItemTrigger Examples ---

// Access properties and text representation
const otherTrigger = new OtherTrigger(pokedex);
console.log(otherTrigger.text);  // Output: somehow

const tradeTrigger = new TradeTrigger(null, pokedex);
console.log(tradeTrigger.text); // Output: when traded

const itemTrigger = new ItemTrigger(1, pokedex); 
console.log(itemTrigger.text);  // Output: using a (Item name)

// --- MoveEffect Examples ---

// Access properties and formatted text
const moveEffect = new MoveEffect(1, 'Inflicts regular damage.', pokedex);
console.log(moveEffect.description); // Output: Inflicts regular damage.


