import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Api } from './Api';
function PokemonOwnerList() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await axios.get(`${Api}/api/pokemon-owners`);
        setOwners(response.data);
      } catch (error) {
        console.error('Error fetching pokemon owners:', error);
      }
    };

    fetchOwners();
  }, []);

  return (
    <div className="pokemon-owner-list">
      <h2>Pokémon Owners</h2>
      <ul>
        {owners.map((owner) => (
          <li key={owner.id}>
            {owner.name} - Pokémon: {owner.pokemon.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokemonOwnerList;
