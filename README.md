# Pokedex
A nodejs library to get all pokemon info from a pokedex!

## Examples
All examples can be found in [examples.js](https://github.com/scaranaraa/pokedex/blob/main/examples.js)

## Documentation 
Documentation can be found [here](https://scaranaraa.github.io/pokedex/)

## Features
- Pokemon Data: Stats, Types, Regions, Evolutions, Descriptions etc
- Move Data: Effects, Properties, Description
- Evolution Data: Triggers, Descriptions
- Items: Effects, Properties

## Example usage
### Initialization 
```js
import {Pokedex} from 'pokedex-v2';
const pokedex = new Pokedex()
await pokedex.init() //necessary
```

1. Get information about specific pokemon
```js
const charizard = pokedex.speciesByName('charizard');
console.log(charizard.toJSON()) // .toJSON() is called to sanitize output
/*
id: 6
height: 1.7,
weight: 90.5,
types: [ 'Fire', 'Flying' ],
description: 'It is said that Charizard’s fire burns hotter if it has experienced harsh battles.',
mega_x_id: 10034,
moves: [Move,Move]
....
*/
```

2. Get evolution information
```js
const charizard = pokedex.speciesByName('charizard');
console.log(charizard.evolution_text)
/*
Charizard evolves from Charmeleon starting from level 36, 
which evolves from Charmander starting from level 16.
*/
```

3. Get move information
```js
const move = pokedex.moveByName('dragon pulse');
console.log(move.toJSON())
/*
id: 406,
slug: 'dragon-pulse',
name: 'Dragon Pulse',
power: 85,
pp: 10,
accuracy: 100
  .....
*/
```

4. Create a pokemon instance
```js
import {Pokedex, Pokemon} from 'pokedex-v2';
const pokedex = new Pokedex()
const randompokemon = pokedex.randomSpawn()
const newpokemon = new Pokemon(randompokemon, pokedex) 
console.log(newpokemon)
//this will give the pokemon a random nature, and random iv stats
```

5. Simulate battle between two Pokemon
```js
import {Pokedex, Pokemon} from 'pokedex-v2';
const pokedex = new Pokedex()

const myPokemon = new Pokemon(pokedex.randomSpawn())
const opponentPokemon = new Pokemon(pokedex.randomSpawn())

const attack = myPokemon.moves[0].move.calculate_turn(myPokemon,opponentPokemon)
console.log(attack)
/*
MoveResult {
  success: true,
  damage: 7,
  healing: 0,
  ailment: 'Confusion',
  messages: [ "It's not very effective..." ],
  stat_changes: [ StatChange { stat_id: 3, change: -1 } ]
}
*/
```
