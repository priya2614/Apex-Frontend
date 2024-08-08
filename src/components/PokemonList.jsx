import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './PokemonList.css';
import  {Api}  from './Api';

function PokemonList() {
    const [pokemonUsers, setPokemonUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        pokemonOwnerName: '',
        pokemonName: '',
        pokemonAbility: ''
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

  const handlePokemonSelect = async (e) => {
    const selectedName = e.target.value;
    setEditingUser(prev => ({
      ...prev,
      pokemons: [{ ...prev.pokemons[0], pokemonName: selectedName, pokemonAbility: '' }]
    }));
    if (selectedName) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${selectedName}`);
        const abilities = response.data.abilities.map(ability => ability.ability.name);
        setSelectedPokemon({ name: selectedName, abilities });
        if (abilities.length === 1) {
          setEditingUser(prev => ({
            ...prev,
            pokemons: [{ ...prev.pokemons[0], pokemonAbility: abilities[0] }]
          }));
        }
      } catch (error) {
        console.error('Error fetching Pokemon details:', error);
      }
    } else {
      setSelectedPokemon(null);
    }
  };


    useEffect(() => {
        fetchPokemonUsers();
    }, []);

    const fetchPokemonUsers = async () => {
        try {
            const response = await axios.get(`${Api}/api/pokemon`);
            setPokemonUsers(response.data);
        } catch (error) {
            console.error('Error fetching Pokemon users:', error);
        }
    };

    const handleDelete = async (pokemonOwnerName) => {
        try {
            await axios.delete(`${Api}/api/pokemon/${pokemonOwnerName}`);
            fetchPokemonUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting Pokemon user:', error);
        }
    };

    const handleDeleteAll = async () => {
        try {
            await axios.delete(`${Api}/api/pokemon`);
            fetchPokemonUsers(); // Refresh the list after deletion
        } catch (error) {
            console.error('Error deleting all Pokemon users:', error);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${Api}/api/pokemon/${editingUser.pokemonOwnerName}`, editingUser);
            setIsModalOpen(false);
            fetchPokemonUsers(); // Refresh the list after update
        } catch (error) {
            console.error('Error updating Pokemon user:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prev => ({
            ...prev,
            [name]: value,
            pokemons: [{ ...prev.pokemons[0], [name]: value }]
        }));
    };

    return (
        <div className="pokemon-list-container">
            <h2 className='heading'>List of Pokemon users</h2>
            <div className="button-group">
                <button onClick={handleDeleteAll} className="delete-all-btn">Delete all</button>
                <Link to="/add-pokemon" className="add-btn">Add Pokemon</Link>
            </div>
            <table className="pokemon-table">
                <thead>
                    <tr>
                        <th>PokemonOwnerName</th>
                        <th>Pokemon Name</th>
                        <th>PokemonAbility</th>
                        <th>No. of pokemon</th>
                        <th>Add pokemon</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {pokemonUsers.map((user) => (
                        <tr key={user.pokemonOwnerName}>
                            <td>{user.pokemonOwnerName}</td>
                            <td>{user.pokemons[0].pokemonName}</td>
                            <td>{user.pokemons[0].pokemonAbility}</td>
                            <td>{user.pokemons.length}</td>
                            <td>
                                <Link to={`/add-pokemon/${user.pokemonOwnerName}`} className="add-btn">+</Link>
                            </td>
                            <td>
                                <button onClick={() => handleEdit(user)} className="edit-btn">Edit</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(user.pokemonOwnerName)} className="delete-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Pokemon User</h2>
                        <form onSubmit={handleUpdate}>
                            <input
                                type="text"
                                name="pokemonOwnerName"
                                value={editingUser.pokemonOwnerName}
                                onChange={handleInputChange}
                                placeholder="Pokemon Owner Name"
                            />
                            <div className="form-group">
                                <label htmlFor="pokemonName">Pokemon Name</label>
                                <select
                                    id="pokemonName"
                                    name="pokemonName"
                                    value={editingUser.pokemons[0].pokemonName}
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
                                    value={editingUser.pokemons[0].pokemonAbility}
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
                            <button type="submit">Update</button>
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PokemonList;