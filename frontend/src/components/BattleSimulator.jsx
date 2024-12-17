import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/BattleSimulator.css';

const BACKEND_URL = 'http://localhost:5000/api/pokemon/';

const BattleSimulator = () => {
  const location = useLocation();
  const { pokemon: playerPokemon } = location.state || { pokemon: { name: 'pikachu', id: 25 } };

  const [playerDetails, setPlayerDetails] = useState(null);
  const [cpuDetails, setCpuDetails] = useState(null);
  const [battleLog, setBattleLog] = useState(['Battle Started!']);
  const [cpuTurn, setCpuTurn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [cpuHP, setCpuHP] = useState(100);

  // Fetch data for Player and CPU Pokémon
  useEffect(() => {
    const fetchData = async () => {
      try {
        const playerResponse = await fetch(`${BACKEND_URL}${playerPokemon.name}`);
        const playerData = await playerResponse.json();

        // Randomly choose a CPU Pokémon
        const randomId = Math.floor(Math.random() * 151) + 1;
        const cpuResponse = await fetch(`${BACKEND_URL}${randomId}`);
        const cpuData = await cpuResponse.json();

        setPlayerDetails(playerData);
        setCpuDetails(cpuData);
        setPlayerHP(playerData.stats[0].base_stat); // Base HP
        setCpuHP(cpuData.stats[0].base_stat); // Base HP
      } catch (error) {
        console.error('Error fetching Pokémon data:', error);
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
    if (playerHP === 0) setWinner('CPU Wins!');
    if (cpuHP === 0) setWinner('You Win!');
  }, [playerHP, cpuHP]);

  if (!playerDetails || !cpuDetails) return <div>Loading Pokémon...</div>;

  return (
    <div className="battle-container">
  <h1>Pokémon Battle Simulator</h1>

  {/* Cards Container */}
  <div className="cards-container">
    {/* Player Section */}
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

    {/* CPU Section */}
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

  {/* Battle Log */}
<div className="battle-log">
  <h3>Battle Log</h3>
  <ul>
    {battleLog.map((log, index) => (
      <li key={index}>{log}</li>
    ))}
  </ul>
</div>

{/* Winner Message */}
{winner && (
  <div className="winner-message">
    <h2>{winner}</h2>
  </div>
)}
</div> 
  );
};

export default BattleSimulator;
