import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
import '../styles/BattleSimulator.css';

const BACKEND_URL = 'http://localhost:5000/api/pokemon/';

// Default Pokémon fallback data
const DEFAULT_PLAYER = {
  name: 'pikachu',
  sprite: '/img/25.png', // Local image for fallback
  stats: [{ base_stat: 100 }],
  moves: ['thunder-shock', 'quick-attack', 'iron-tail', 'electro-ball'],
};

const DEFAULT_CPU = {
  name: 'charmander',
  sprite: '/img/4.png', // Local image for fallback
  stats: [{ base_stat: 100 }],
  moves: ['ember', 'scratch', 'smokescreen', 'growl'],
};

const BattleSimulator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pokemon: playerPokemon } = location.state || { pokemon: { name: 'pikachu', id: 25 } };

  const [playerDetails, setPlayerDetails] = useState(null);
  const [cpuDetails, setCpuDetails] = useState(null);
  const [battleLog, setBattleLog] = useState(['Battle Started!']);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [cpuHP, setCpuHP] = useState(100);

  // Fetch Pokémon data with fallback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerResponse = await fetch(`${BACKEND_URL}${playerPokemon.name}`);
        if (!playerResponse.ok) throw new Error('Player API failed');
        const playerData = await playerResponse.json();

        const randomId = Math.floor(Math.random() * 151) + 1;
        const cpuResponse = await fetch(`${BACKEND_URL}${randomId}`);
        if (!cpuResponse.ok) throw new Error('CPU API failed');
        const cpuData = await cpuResponse.json();

        setPlayerDetails(playerData);
        setCpuDetails(cpuData);
        setPlayerHP(playerData.stats[0].base_stat); // Base HP
        setCpuHP(cpuData.stats[0].base_stat); // Base HP
      } catch (error) {
        console.error('Error fetching Pokémon data:', error.message);
        alert('API is currently unavailable. Default Pokémon will be used.');

        // Use fallback Pokémon data
        setPlayerDetails(DEFAULT_PLAYER);
        setCpuDetails(DEFAULT_CPU);
        setPlayerHP(DEFAULT_PLAYER.stats[0].base_stat);
        setCpuHP(DEFAULT_CPU.stats[0].base_stat);
      }
    };

    fetchData();
  }, [playerPokemon]);

  const handleMove = (move) => {
    if (!playerDetails || !cpuDetails) return;

    const damage = Math.floor(Math.random() * 20) + 10; // Random damage 10-30
    setCpuHP((prev) => Math.max(prev - damage, 0));
    setBattleLog((prev) => [...prev, `${playerDetails.name} used ${move} for ${damage} damage!`]);
    setCpuTurn(true);
  };

  useEffect(() => {
    if (cpuTurn && cpuDetails) {
      const randomMove = cpuDetails.moves[Math.floor(Math.random() * cpuDetails.moves.length)];
      const damage = Math.floor(Math.random() * 20) + 10;

      setPlayerHP((prev) => Math.max(prev - damage, 0));
      setBattleLog((prev) => [...prev, `${cpuDetails.name} used ${randomMove} for ${damage} damage!`]);
      setCpuTurn(false);
    }
  }, [cpuTurn, cpuDetails]);

  useEffect(() => {
    if (playerHP === 0 && !winner) {
      setWinner('CPU Wins!');
    } else if (cpuHP === 0 && !winner) {
      setWinner('You Win!');
    }
  }, [playerHP, cpuHP, winner]);

  useEffect(() => {
    const updateStats = async () => {
      if (!winner || !auth.currentUser) return;

      const userRef = doc(db, 'users', auth.currentUser.uid);

      try {
        if (winner === 'You Win!') {
          await updateDoc(userRef, { wins: increment(1) });
        } else if (winner === 'CPU Wins!') {
          await updateDoc(userRef, { losses: increment(1) });
        }
      } catch (error) {
        console.error('Error updating user stats:', error);
      }
    };

    updateStats();
  }, [winner]);

  if (!playerDetails || !cpuDetails) return <div>Loading Pokémon...</div>;

  return (
    <div className="battle-container">
      <h1>Pokémon Battle Simulator</h1>

      <div className="cards-container">
        <div className="player">
          <h2>Player: {playerDetails.name.toUpperCase()}</h2>
          <img src={playerDetails.sprite} alt={playerDetails.name} />
          <div className="health-bar">
            <div
              className="health-bar-inner player"
              style={{ width: `${(playerHP / playerDetails.stats[0].base_stat) * 100}%` }}
            ></div>
          </div>
          <p>HP: {playerHP}</p>
          <div className="moves-container">
            {playerDetails.moves.map((move) => (
              <button key={move} onClick={() => handleMove(move)} disabled={cpuHP === 0 || playerHP === 0}>
                {move.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="player">
          <h2>CPU: {cpuDetails.name.toUpperCase()}</h2>
          <img src={cpuDetails.sprite} alt={cpuDetails.name} />
          <div className="health-bar">
            <div
              className="health-bar-inner cpu"
              style={{ width: `${(cpuHP / cpuDetails.stats[0].base_stat) * 100}%` }}
            ></div>
          </div>
          <p>HP: {cpuHP}</p>
        </div>
      </div>

      <div className="battle-log">
        <h3>Battle Log</h3>
        <ul>
          {battleLog.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>

      {winner && (
        <div className="winner-message">
          <h2>{winner}</h2>
          <button onClick={() => navigate('/select-pokemon')} className="replay-button">
            Replay
          </button>
        </div>
      )}
    </div>
  );
};

export default BattleSimulator;
