import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Api } from './Api';
function PokemonOwnerStats({ ownerId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Api}/api/pokemon/${ownerId}`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch owner stats');
        setLoading(false);
      }
    };

    fetchOwnerStats();
  }, [ownerId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="pokemon-owner-stats">
      <h3>{stats.ownerName}'s Pokémon</h3>
      <p>Total Pokémon: {stats.pokemonCount}</p>
      <table>
        <thead>
          <tr>
            <th>Pokémon Name</th>
            <th>Ability</th>
          </tr>
        </thead>
        <tbody>
          {stats.pokemon.map((pokemon, index) => (
            <tr key={index}>
              <td>{pokemon.name}</td>
              <td>{pokemon.ability}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PokemonOwnerStats;