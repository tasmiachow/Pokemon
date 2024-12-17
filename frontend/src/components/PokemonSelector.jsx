import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PokemonSelector.css';

const POKEMON_DATA = [
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 7, name: 'squirtle' },
  { id: 25, name: 'pikachu' },
  { id: 39, name: 'jigglypuff' },
  { id: 137, name: 'porygon' },
  { id: 144, name: 'articuno' },
  { id: 151, name: 'mew' },
  { id: 175, name: 'togepi' },
  { id: 249, name: 'lugia' },
  { id: 393, name: 'piplup' },
  { id: 399, name: 'bidoof' },
  { id: 483, name: 'dialga' },
  { id: 727, name: 'incineroar' },
  { id: 792, name: 'lunala' },
];

const PokemonSelector = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(POKEMON_DATA[0]);
  const navigate = useNavigate(); // For navigation

  const handleChange = (e) => {
    const chosenPokemon = POKEMON_DATA.find(
      (pokemon) => pokemon.id === parseInt(e.target.value)
    );
    setSelectedPokemon(chosenPokemon);
  };

  const handleSubmit = () => {
    // Navigate to battle simulator with selected Pokémon
    navigate('/battle-simulator', { state: { pokemon: selectedPokemon } });
  };

  return (
    <div className="pokemon-selector">
      <h1>Select Your Pokémon</h1>
      <select onChange={handleChange} value={selectedPokemon.id}>
        {POKEMON_DATA.map((pokemon) => (
          <option key={pokemon.id} value={pokemon.id}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </option>
        ))}
      </select>
      <div className="pokemon-display">
        <h2>{selectedPokemon.name.toUpperCase()}</h2>
        <img
          src={`/img/${selectedPokemon.id}.png`}
          alt={selectedPokemon.name}
          className="pokemon-image"
        />
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PokemonSelector;
