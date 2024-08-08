import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './AddPokemon.css';
import { Api } from './Api';

function AddPokemon() {
  const [formData, setFormData] = useState({
    id: '',
    pokemonOwnerName: '',
    direction: '',
    initialPositionX: 0,
    initialPositionY: 0,
    pokemonName: '',
    pokemonAbility: '',
    speed: 0,
  });
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    // Fetch the list of Pokemon names when the component mounts
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000');
        setPokemonList(response.data.results);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };
    fetchPokemonList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePokemonSelect = async (e) => {
    const selectedName = e.target.value;
    setFormData({ ...formData, pokemonName: selectedName, pokemonAbility: '' });
    if (selectedName) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${selectedName}`);
        const abilities = response.data.abilities.map(ability => ability.ability.name);
        setSelectedPokemon({ name: selectedName, abilities });
        if (abilities.length === 1) {
          setFormData(prev => ({ ...prev, pokemonAbility: abilities[0] }));
        }
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    } else {
      setSelectedPokemon(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pokemonWithId = { ...formData, id: uuidv4() };
    console.log('Form submitted with data:', pokemonWithId);
    try {
      const response = await axios.post(`${Api}/api/pokemon`, pokemonWithId);
      console.log('Server response:', response.data);

      // Reset form after successful submission
      setFormData({
        id: '',
        pokemonOwnerName: '',
        direction: '',
        initialPositionX: 0,
        initialPositionY: 0,
        pokemonName: '',
        pokemonAbility: '',
        speed: 0,
      });
      setSelectedPokemon(null);

      alert('Pokemon added successfully!');
    } catch (error) {
      console.error('Error details:', error);
      alert(`Error adding Pokemon: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="body">
      <div className='form-controls'>
      <h2 className='add-pokeman'>Add Pokemon</h2>
      <form className="add-pokemon-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pokemonOwnerName">Pokemon Owner Name</label>
          <input
            id="pokemonOwnerName"
            type="text"
            name="pokemonOwnerName"
            placeholder='Enter owner name'
            value={formData.pokemonOwnerName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="direction">Direction</label>
          <input
            id="direction"
            type="text"
            name="direction"
            placeholder='Enter direction'
            value={formData.direction}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="initialPositionX">Initial Position X</label>
          <input
            id="initialPositionX"
            type="number"
            name="initialPositionX"
            value={formData.initialPositionX}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="initialPositionY">Initial Position Y</label>
          <input
            id="initialPositionY"
            type="number"
            name="initialPositionY"
            value={formData.initialPositionY}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="pokemonName">Pokemon Name</label>
          <select
            id="pokemonName"
            name="pokemonName"
            value={formData.pokemonName}
            onChange={handlePokemonSelect}
            required
          >
            <option value="">Select a Pokemon</option>
            {pokemonList.map(pokemon => (
              <option key={pokemon.name} value={pokemon.name}>
                {pokemon.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="pokemonAbility">Pokemon Ability</label>
          <select
            id="pokemonAbility"
            name="pokemonAbility"
            value={formData.pokemonAbility}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Ability</option>
            {selectedPokemon && selectedPokemon.abilities.map(ability => (
              <option key={ability} value={ability}>
                {ability}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="speed">Speed</label>
          <input
            id="speed"
            type="number"
            name="speed"
            value={formData.speed}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className='btn'  type="submit">CREATE.. </button>
      </form>
      </div>
    </div>
  );
}

export default AddPokemon;