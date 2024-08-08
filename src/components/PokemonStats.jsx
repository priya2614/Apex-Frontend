import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Api } from './Api';

function PokemonStats({ pokemonId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPokemonStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Api}/api/pokemon/${pokemonId}/stats`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch Pokemon stats');
        setLoading(false);
      }
    };

    fetchPokemonStats();
  }, [pokemonId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!stats) return null;

  return (
    <div className="pokemon-stats">
      <h3>Pokemon Stats</h3>
      <ul>
        <li>HP: {stats.hp}</li>
        <li>Attack: {stats.attack}</li>
        <li>Defense: {stats.defense}</li>
        <li>Speed: {stats.speed}</li>
      </ul>
    </div>
  );
}

export default PokemonStats;
