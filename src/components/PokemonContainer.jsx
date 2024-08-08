import React from 'react';
import Pokemon from './Pokemon';

const PokemonContainer = ({ pokemons, isMoving, isPokemonFleeing, isPokemonFrozen }) => {
  return (
    <div className="pokemon-container">
      {pokemons.map((pokemon) => (
        <Pokemon
          key={pokemon.id}
          {...pokemon}
          isMoving={isMoving && !isPokemonFrozen}
          isVisible={!isPokemonFleeing}
        />
      ))}
    </div>
  );
};

export default PokemonContainer;
